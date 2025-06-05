from cryptography.fernet import Fernet
import os
import sys

def generate_key():
    """Generate a new encryption key"""
    return Fernet.generate_key()

def load_key(key_file):
    """Load the encryption key from a file"""
    try:
        with open(key_file, 'rb') as f:
            return f.read()
    except FileNotFoundError:
        key = generate_key()
        with open(key_file, 'wb') as f:
            f.write(key)
        return key

def encrypt_file(input_file, output_file, key):
    """Encrypt a file using the provided key"""
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file not found: {input_file}")
    
    f = Fernet(key)
    
    # Get file size for progress reporting
    file_size = os.path.getsize(input_file)
    
    with open(input_file, 'rb') as file:
        file_data = file.read()
        print(f"Processing {file_size/1024:.2f} KB...")
    
    encrypted_data = f.encrypt(file_data)
    
    with open(output_file, 'wb') as file:
        file.write(encrypted_data)

def decrypt_file(input_file, output_file, key):
    """Decrypt a file using the provided key"""
    if not os.path.exists(input_file):
        raise FileNotFoundError(f"Input file not found: {input_file}")
    
    f = Fernet(key)
    
    # Get file size for progress reporting
    file_size = os.path.getsize(input_file)
    
    with open(input_file, 'rb') as file:
        encrypted_data = file.read()
        print(f"Processing {file_size/1024:.2f} KB...")
    
    decrypted_data = f.decrypt(encrypted_data)
    
    with open(output_file, 'wb') as file:
        file.write(decrypted_data)

def main():
    if len(sys.argv) < 4:
        print("Usage: python file_crypto.py [encrypt/decrypt] [input_file] [output_file]")
        sys.exit(1)

    operation = sys.argv[1].lower()
    input_file = os.path.abspath(sys.argv[2])
    output_file = os.path.abspath(sys.argv[3])
    key_file = os.path.join(os.path.dirname(__file__), "encryption_key.key")

    # Load or generate the encryption key
    key = load_key(key_file)

    try:
        if operation == "encrypt":
            encrypt_file(input_file, output_file, key)
            print(f"File encrypted successfully: {output_file}")
        elif operation == "decrypt":
            decrypt_file(input_file, output_file, key)
            print(f"File decrypted successfully: {output_file}")
        else:
            print("Invalid operation. Use 'encrypt' or 'decrypt'")
    except Exception as e:
        print(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()