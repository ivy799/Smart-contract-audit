import textwrap

def format_file(path):
    with open(path, 'r') as file:
        code = file.read()
        code = code.strip()
        code = textwrap.dedent(code)
    
    return code

def format_content(content):
    """Format Solidity code from string content"""
    if not content:
        return ""
    
    code = content.strip()
    code = textwrap.dedent(code)
    
    return code