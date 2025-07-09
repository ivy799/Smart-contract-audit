import solcx
import re
from packaging import version
from typing import Tuple, Optional, List, Dict, Any

def extract_contract_metadata(ast_data: Dict[str, Any], content: str, additional_info: Dict[str, Any] = None) -> Dict[str, Any]:
    # Mulai dengan metadata default
    metadata = {
        "name": None,
        "version": None,
        "license": None,
        "inherits": [],
        "contract_name": None,
        "solidity_version": None,
        "token_address": None  # Default null
    }
    
    # Update dengan additional_info TERLEBIH DAHULU
    if additional_info:
        metadata.update(additional_info)
    
    try:
        if "nodes" in ast_data:
            # Cari kontrak utama berdasarkan prioritas
            main_contract = None
            contracts = []
            
            # Kumpulkan semua kontrak definisi
            for node in ast_data["nodes"]:
                if node.get("nodeType") == "ContractDefinition":
                    contracts.append(node)
            
            if contracts:
                # Prioritas 1: Cari kontrak dengan nama yang sama dengan contract_name dari additional_info
                if additional_info and additional_info.get("contract_name"):
                    target_name = additional_info["contract_name"]
                    for contract in contracts:
                        if contract.get("name") == target_name:
                            main_contract = contract
                            break
                
                # Prioritas 2: Ambil kontrak non-abstract terakhir (skip interface dan library)
                if not main_contract:
                    for contract in reversed(contracts):
                        if (not contract.get("abstract", False) and 
                            contract.get("contractKind") == "contract"):
                            main_contract = contract
                            break
                
                # Prioritas 3: Ambil kontrak terakhir apapun jenisnya (kecuali interface)
                if not main_contract:
                    for contract in reversed(contracts):
                        if contract.get("contractKind") != "interface":
                            main_contract = contract
                            break
                
                # Prioritas 4: Ambil kontrak terakhir apapun
                if not main_contract and contracts:
                    main_contract = contracts[-1]
                
                if main_contract:
                    # Update name hanya jika belum ada
                    if not metadata.get("name"):
                        metadata["name"] = main_contract.get("name")
                    
                    # Update contract_name hanya jika belum ada
                    if not metadata.get("contract_name"):
                        metadata["contract_name"] = main_contract.get("name")
                    
                    if "baseContracts" in main_contract:
                        for base in main_contract["baseContracts"]:
                            if "baseName" in base and "name" in base["baseName"]:
                                metadata["inherits"].append(base["baseName"]["name"])
        
        # Ekstrak versi pragma hanya jika belum ada
        if not metadata.get("version"):
            pragma_versions = extract_all_pragma_versions(content)
            if pragma_versions:
                metadata["version"] = pragma_versions[0]
        
        # Ekstrak license hanya jika belum ada
        if not metadata.get("license"):
            license_match = re.search(r'//\s*SPDX-License-Identifier:\s*([^\n\r]+)', content, re.IGNORECASE)
            if license_match:
                metadata["license"] = license_match.group(1).strip()
        
        print(f"DEBUG: Final extracted metadata: {metadata}")
        return metadata
        
    except Exception as e:
        print(f"DEBUG: Error extracting metadata: {e}")
        return metadata

def ensure_solc_version_available(target_version: str) -> bool:
    try:
        installed_versions = [str(v) for v in solcx.get_installed_solc_versions()]
        if target_version in installed_versions:
            print(f"DEBUG: Version {target_version} already installed")
            return True
        print(f"DEBUG: Installing Solidity version {target_version}...")
        solcx.install_solc(target_version, show_progress=False)
        print(f"DEBUG: Successfully installed {target_version}")
        return True
    except Exception as e:
        print(f"DEBUG: Failed to install {target_version}: {e}")
        return False

def extract_all_pragma_versions(content: str) -> list:
    pragma_patterns = [
        r'pragma\s+solidity\s+([^;]+);',
        r'pragma\s+solidity\s*([^;]+);',
        r'//\s*pragma\s+solidity\s+([^;]+);'
    ]
    versions = []
    for pattern in pragma_patterns:
        matches = re.findall(pattern, content, re.IGNORECASE | re.MULTILINE)
        for m in matches:
            versions.append(m.strip())
    return versions

def parse_version_spec(version_spec: str) -> Tuple[str, str]:
    version_spec = version_spec.strip()
    if re.match(r'^\d+\.\d+\.\d+$', version_spec):
        return "=", version_spec
    caret_match = re.match(r'^\^(\d+\.\d+\.\d+)$', version_spec)
    if caret_match:
        return "^", caret_match.group(1)
    range_match = re.match(r'>=\s*(\d+\.\d+\.\d+)\s*<\s*(\d+\.\d+\.\d+)', version_spec)
    if range_match:
        return "range", f"{range_match.group(1)}-{range_match.group(2)}"
    operator_match = re.match(r'([><=]+)\s*(\d+\.\d+\.\d+)', version_spec)
    if operator_match:
        return operator_match.group(1), operator_match.group(2)
    tilde_match = re.match(r'~(\d+\.\d+\.\d+)$', version_spec)
    if tilde_match:
        return "~", tilde_match.group(1)
    version_clean = re.sub(r'[^\d\.]', '', version_spec)
    if re.match(r'^\d+\.\d+(\.\d+)?$', version_clean):
        return "~", version_clean if version_clean.count('.') == 2 else version_clean + '.0'
    return "unknown", version_spec

def get_most_strict_pragma_version(versions: list) -> str:

    if not versions:
        raise Exception("No pragma solidity found in source code.")

    exact_versions = []
    range_versions = []

    for v in versions:
        op, val = parse_version_spec(v)
        if op == "=":
            exact_versions.append(val)
        else:
            range_versions.append((op, val))

    if exact_versions:
        majors = set(ver.split('.')[0] for ver in exact_versions)
        if len(majors) > 1:
            raise Exception(f"Conflicting pragma versions found: {exact_versions}")
        return max(exact_versions, key=lambda x: version.parse(x))

    if range_versions:
        candidates = []
        for op, val in range_versions:
            candidates.append(val)
        majors = set(ver.split('.')[0] for ver in candidates)
        if len(majors) > 1:
            raise Exception(f"Conflicting pragma major versions found (range): {candidates}")
        return max(candidates, key=lambda x: version.parse(x))

    raise Exception("No valid pragma found.")

def find_precise_version(version_spec: str) -> Optional[str]:
    if not version_spec:
        return None
    operator, target_version = parse_version_spec(version_spec)
    try:
        available_versions = solcx.get_available_solc_versions()
        available_str = [str(v) for v in available_versions]
    except Exception as e:
        print(f"DEBUG: Error getting versions: {e}")
        available_str = []
    if operator == "=":
        if target_version in available_str:
            return target_version
        else:
            print(f"DEBUG: Exact version {target_version} not available in list, will try to install anyway.")
            return target_version
    elif operator in ("^", "~", "range", ">=", "<=", ">", "<"):
        if operator == "^" or operator == "~":
            major_minor = '.'.join(target_version.split('.')[:2])
            filtered = [v for v in available_str if v.startswith(major_minor) and version.parse(v) >= version.parse(target_version)]
            if filtered:
                return max(filtered, key=lambda x: version.parse(x))
            return target_version
        elif operator == "range":
            min_ver, max_ver = target_version.split('-')
            filtered = [v for v in available_str if version.parse(min_ver) <= version.parse(v) < version.parse(max_ver)]
            if filtered:
                return max(filtered, key=lambda x: version.parse(x))
            return min_ver
        elif operator in [">=", ">", "<=", "<"]:
            filtered = []
            if operator == ">=":
                filtered = [v for v in available_str if version.parse(v) >= version.parse(target_version)]
            elif operator == ">":
                filtered = [v for v in available_str if version.parse(v) > version.parse(target_version)]
            elif operator == "<=":
                filtered = [v for v in available_str if version.parse(v) <= version.parse(target_version)]
            elif operator == "<":
                filtered = [v for v in available_str if version.parse(v) < version.parse(target_version)]
            if filtered:
                return max(filtered, key=lambda x: version.parse(x))
            return target_version
    return target_version

def set_solidity_version_from_code(version_spec: str) -> str:
    print(f"DEBUG: Setting Solidity version for pragma spec: {version_spec}")
    target_version = find_precise_version(version_spec)
    if not target_version:
        raise Exception("No version specification found in pragma.")
    if ensure_solc_version_available(target_version):
        try:
            solcx.set_solc_version(target_version)
            print(f"DEBUG: Successfully set version: {target_version}")
            return target_version
        except Exception as e:
            print(f"DEBUG: Failed to set version {target_version}: {e}")
            raise Exception(f"Could not set Solidity version: {target_version}")
    else:
        raise Exception(f"Could not install Solidity version: {target_version}")

def detect_solidity_version(content: str) -> str:
    pragma_versions = extract_all_pragma_versions(content)
    if not pragma_versions:
        raise Exception("No pragma solidity version found in input code.")
    target_version = get_most_strict_pragma_version(pragma_versions)
    return set_solidity_version_from_code(target_version)

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

def parse_ast(content: str, additional_metadata: Dict[str, Any] = None) -> Dict[str, Any]:
    try:
        print(f"DEBUG: Content length: {len(content)} characters")
        print(f"DEBUG: Content preview: {content[:200]}...")
        
        processed_content, removed_imports = preprocess_solidity_content(content)
        actual_version = detect_solidity_version(processed_content)
        print(f"DEBUG: Using Solidity version: {actual_version}")
        
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
                },
                "optimizer": {
                    "enabled": False
                },
                "remappings": []
            }
        }
        
        print(f"DEBUG: Compiling with Solidity {actual_version}...")
        output_json = solcx.compile_standard(input_json)
        
        compilation_warnings = []
        if "errors" in output_json:
            errors = output_json["errors"]
            fatal_errors = [e for e in errors if e.get("severity") == "error"]
            warning_errors = [e for e in errors if e.get("severity") in ["warning", "info"]]
            
            if fatal_errors:
                error_messages = [e.get("formattedMessage", e.get("message", str(e))) for e in fatal_errors]
                print(f"DEBUG: Fatal compilation errors: {error_messages}")
                raise Exception(f"Compilation errors: {'; '.join(error_messages)}")
            else:
                print(f"DEBUG: Non-fatal warnings: {len(warning_errors)} warnings found")
                compilation_warnings = [e.get("formattedMessage", e.get("message", str(e))) for e in warning_errors]
        
        ast_data = None
        if "sources" in output_json and "contract.sol" in output_json["sources"]:
            if "ast" in output_json["sources"]["contract.sol"]:
                ast_data = output_json["sources"]["contract.sol"]["ast"]
                print(f"DEBUG: Successfully extracted AST from main contract")
        
        if not ast_data:
            print("DEBUG: AST not found in expected location")
            print(f"DEBUG: Available keys in output: {list(output_json.keys())}")
            if "sources" in output_json:
                print(f"DEBUG: Available sources: {list(output_json['sources'].keys())}")
            raise Exception("AST data not found in compilation output")
        
        metadata_info = {
            "solidity_version": actual_version
        }
        if additional_metadata:
            metadata_info.update(additional_metadata)
        
        contract_metadata = extract_contract_metadata(ast_data, content, metadata_info)
        
        if "license" in ast_data:
            del ast_data["license"]
            
        return {
            "success": True,
            "ast": ast_data,
            "warnings": compilation_warnings,
            "removed_imports": removed_imports,
            "contract_metadata": contract_metadata
        }
        
    except Exception as e:
        print(f"DEBUG: Parse AST error: {str(e)}")
        
        default_metadata = {
            "name": None,
            "version": None,
            "license": None,
            "inherits": [],
            "contract_name": None,
            "solidity_version": None,
            "token_address": None
        }
        
        if additional_metadata:
            default_metadata.update(additional_metadata)
        
        return {
            "success": False,
            "error": str(e),
            "ast": None,
            "warnings": [],
            "removed_imports": [],
            "contract_metadata": default_metadata
        }