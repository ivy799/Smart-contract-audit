import solcx

def parse_ast(solidity_code):
    """
    Parse Solidity code and return AST
    """
    try:
        try:
            solcx.set_solc_version('0.8.20')
        except Exception:
            solcx.install_solc('0.8.20')
            solcx.set_solc_version('0.8.20')
        
        input_json = {
            "language": "Solidity",
            "sources": {
                "contract.sol": {
                    "content": solidity_code
                }
            },
            "settings": {
                "outputSelection": {
                    "*": {
                        "*": ["abi", "evm.bytecode", "evm.deployedBytecode"],
                        "": ["ast"]  
                    }
                }
            }
        }
        
        output_json = solcx.compile_standard(input_json)
        
        print("DEBUG: Compiler output structure:")
        print(f"Keys in output_json: {list(output_json.keys())}")
        if "sources" in output_json:
            print(f"Sources keys: {list(output_json['sources'].keys())}")
            for source_name, source_data in output_json["sources"].items():
                print(f"Keys in {source_name}: {list(source_data.keys()) if isinstance(source_data, dict) else 'Not a dict'}")
        
        ast_data = None
        
        if "ast" in output_json:
            ast_data = output_json["ast"]
            print("DEBUG: Found AST at top level")
        elif "sources" in output_json:
            for source_name, source_data in output_json["sources"].items():
                if isinstance(source_data, dict) and "ast" in source_data:
                    ast_data = source_data["ast"]
                    print(f"DEBUG: Found AST in sources.{source_name}")
                    break
        
        if not ast_data and "contracts" in output_json:
            for file_name, file_content in output_json["contracts"].items():
                if isinstance(file_content, dict):
                    for contract_name, contract_data in file_content.items():
                        if isinstance(contract_data, dict) and "ast" in contract_data:
                            ast_data = contract_data["ast"]
                            print(f"DEBUG: Found AST in contracts.{file_name}.{contract_name}")
                            break
                if ast_data:
                    break
        
        print(f"DEBUG: Final ast_data is: {'None' if ast_data is None else 'Found'}")
        
        return {
            "success": True,
            "ast": ast_data,
            "compiled_output": output_json
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "ast": None
        }