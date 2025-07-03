import requests
import time

def get_contract_source(address, api_key):
    if not api_key:
        raise Exception("ETHERSCAN_API_KEY tidak ditemukan di environment variables")
    
    if not address or len(address) != 42 or not address.startswith('0x'):
        raise Exception(f"Format address tidak valid: {address}")
    
    url = "https://api.etherscan.io/api"
    params = {
        "module": "contract",
        "action": "getsourcecode", 
        "address": address,
        "apikey": api_key
    }

    try:
        response = requests.get(url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
        
        print(f"DEBUG: Etherscan response status: {data.get('status')}")
        print(f"DEBUG: Etherscan response message: {data.get('message')}")
        print(f"DEBUG: Full response: {data}")
        
        if data["status"] != "1":
            if data.get("message") == "NOTOK":
                if "result" in data and data["result"]:
                    error_detail = data["result"]
                else:
                    error_detail = "API key invalid atau rate limit tercapai"
            else:
                error_detail = data.get("message", "Unknown error")
            raise Exception(f"Gagal mengambil source: {error_detail}")
        
        if not data.get("result") or len(data["result"]) == 0:
            raise Exception("Contract tidak ditemukan")
            
        result = data["result"][0]
        source_code = result.get("SourceCode", "")
        contract_name = result.get("ContractName", "")
        
        if not source_code:
            raise Exception("Contract source code kosong - mungkin contract tidak verified")
        
        return {
            "contract_name": contract_name,
            "source_code": source_code
        }
        
    except requests.exceptions.RequestException as e:
        raise Exception(f"Network error: {str(e)}")
    except Exception as e:
        raise Exception(f"Error: {str(e)}")