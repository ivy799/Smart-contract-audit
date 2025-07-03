import solcx
import re
import os
import tempfile

def detect_solidity_version(content):
    pragma_pattern = r'pragma\s+solidity\s+([^;]+);'
    matches = re.findall(pragma_pattern, content)
    
    if matches:
        version_spec = matches[0].strip()
        print(f"DEBUG: Found pragma solidity {version_spec}")
        
        if re.match(r'^\d+\.\d+\.\d+$', version_spec):
            return version_spec

        version_clean = re.sub(r'[^\d\.]', '', version_spec)

        version_parts = version_clean.split('.')
        if len(version_parts) >= 2:
            major_minor = f"{version_parts[0]}.{version_parts[1]}"
            
            if major_minor == '0.3':
                return '0.4.26'  
            elif major_minor == '0.4':
                return '0.4.26'
            elif major_minor == '0.5':
                return '0.5.17'
            elif major_minor == '0.6':
                return '0.6.12'
            elif major_minor == '0.7':
                return '0.7.6'
            elif major_minor == '0.8':
                if len(version_parts) >= 3:
                    patch = int(version_parts[2])
                    if patch >= 29:
                        return '0.8.29'  
                    elif patch >= 20:
                        return '0.8.20'
                    else:
                        return '0.8.20'  
                return '0.8.20'
            else:
                return '0.8.20'
        else:
            return '0.8.20'
    
    print("DEBUG: No pragma found, using default 0.8.20")
    return '0.8.20'

def get_available_solc_versions():
    try:
        return solcx.get_available_solc_versions()
    except:
        return []

def install_solc_version(version):
    try:
        print(f"DEBUG: Attempting to install Solidity {version}")
        solcx.install_solc(version)
        solcx.set_solc_version(version)
        print(f"DEBUG: Successfully installed and set Solidity {version}")
        return version
    except Exception as e:
        print(f"DEBUG: Failed to install {version}: {e}")
        
        if version.startswith('0.8.'):
            fallback_versions = ['0.8.24', '0.8.23', '0.8.22', '0.8.21', '0.8.20', '0.8.19']
        elif version.startswith('0.7.'):
            fallback_versions = ['0.7.6']
        elif version.startswith('0.6.'):
            fallback_versions = ['0.6.12']
        elif version.startswith('0.5.'):
            fallback_versions = ['0.5.17']
        else:
            fallback_versions = ['0.4.26']
        
        for fallback in fallback_versions:
            try:
                print(f"DEBUG: Trying fallback version: {fallback}")
                solcx.install_solc(fallback)
                solcx.set_solc_version(fallback)
                print(f"DEBUG: Successfully using fallback version: {fallback}")
                return fallback
            except Exception as fallback_e:
                print(f"DEBUG: Fallback {fallback} also failed: {fallback_e}")
                continue
        
        raise Exception(f"Could not install any compatible Solidity version for {version}")

def clean_multiple_spdx_licenses(content):
    lines = content.split('\n')
    spdx_found = False
    cleaned_lines = []
    
    for line in lines:
        if re.search(r'//\s*SPDX-License-Identifier:', line, re.IGNORECASE):
            if not spdx_found:
                cleaned_lines.append(line)
                spdx_found = True
                print(f"DEBUG: Keeping SPDX license: {line.strip()}")
            else:
                print(f"DEBUG: Removing duplicate SPDX license: {line.strip()}")
                continue
        else:
            cleaned_lines.append(line)
    
    return '\n'.join(cleaned_lines)

def strip_imports_and_focus_on_main_code(content):

    lines = content.split('\n')
    filtered_lines = []
    removed_imports = []
    
    for line in lines:
        stripped_line = line.strip()
        
        if (stripped_line.startswith('import ') or 
            re.match(r'^\s*import\s+', line)):
            removed_imports.append(line.strip())
            print(f"DEBUG: Removing import: {line.strip()}")
            continue
        
        filtered_lines.append(line)
    
    filtered_content = '\n'.join(filtered_lines)
    
    print(f"DEBUG: Removed {len(removed_imports)} import statements")
    print(f"DEBUG: Content length reduced from {len(content)} to {len(filtered_content)} characters")
    
    return filtered_content, removed_imports

def preprocess_solidity_content(content):
    print("DEBUG: Starting content preprocessing...")
    
    content = clean_multiple_spdx_licenses(content)
    processed_content, removed_imports = strip_imports_and_focus_on_main_code(content)
    
    print(f"DEBUG: Removed {len(removed_imports)} import statements")
    
    return processed_content, removed_imports

def parse_ast(content):
    """Parse AST from Solidity content focusing only on the main contract code"""
    try:
        print(f"DEBUG: Content length: {len(content)} characters")
        print(f"DEBUG: Content preview: {content[:200]}...")
        
        processed_content, removed_imports = preprocess_solidity_content(content)
        
        detected_version = detect_solidity_version(processed_content)
        print(f"DEBUG: Detected Solidity version: {detected_version}")
        
        try:
            solcx.set_solc_version(detected_version)
            print(f"DEBUG: Using already installed Solidity {detected_version}")
            actual_version = detected_version
        except Exception:
            actual_version = install_solc_version(detected_version)
        
        sources = {
            "contract.sol": {
                "content": processed_content
            }
        }
        
        input_json = {
            "language": "Solidity",
            "sources": sources,
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "evm.bytecode", "evm.deployedBytecode"],
                        "": ["ast"]
                    }
                }
            }
        }
        
        print(f"DEBUG: Compiling with Solidity {actual_version}...")
        print(f"DEBUG: Compiling main contract only (no dependencies)")
        output_json = solcx.compile_standard(input_json)
        
        compilation_warnings = []
        if "errors" in output_json:
            errors = output_json["errors"]
            fatal_errors = [e for e in errors if e.get("severity") == "error"]
            warning_errors = [e for e in errors if e.get("severity") in ["warning", "info"]]
            
            if fatal_errors:
                error_messages = [e.get("formattedMessage", e.get("message", str(e))) for e in fatal_errors]
                raise Exception(f"Compilation errors: {'; '.join(error_messages)}")
            else:
                print(f"DEBUG: Non-fatal warnings: {len(errors)} warnings found")
                compilation_warnings = [e.get("formattedMessage", e.get("message", str(e))) for e in warning_errors]
        
        ast_data = None
        if "sources" in output_json and "contract.sol" in output_json["sources"]:
            if "ast" in output_json["sources"]["contract.sol"]:
                ast_data = output_json["sources"]["contract.sol"]["ast"]
                print(f"DEBUG: Successfully extracted AST from main contract")
        
        if not ast_data:
            print("DEBUG: AST not found in expected location")
            print(f"DEBUG: Available keys in output: {list(output_json.keys())}")
            raise Exception("AST data not found in compilation output")
        
        return {
            "success": True,
            "ast": ast_data,
            "compiled_output": output_json,
            "solidity_version": actual_version,
            "warnings": compilation_warnings,
            "removed_imports": removed_imports
        }
        
    except Exception as e:
        print(f"DEBUG: Parse AST error: {str(e)}")
        return {
            "success": False,
            "error": str(e),
            "ast": None
        }