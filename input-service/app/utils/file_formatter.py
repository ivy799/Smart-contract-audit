def format_file(path):
    with open(path, 'r') as file:
        code = file.read()
    
    return code.strip()