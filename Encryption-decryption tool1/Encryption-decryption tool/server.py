from flask import Flask, request, send_file, render_template
from flask_cors import CORS
import os
from file_crypto1 import encrypt_file, decrypt_file, load_key

app = Flask(__name__, 
    static_folder='static',    # Add this line
    static_url_path=''         # Add this line
)
CORS(app)

UPLOAD_FOLDER = 'temp'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/api/<operation>', methods=['POST'])
def process_file(operation):
    if 'file' not in request.files:
        return 'No file part', 400
    
    file = request.files['file']
    if file.filename == '':
        return 'No selected file', 400

    try:
        # Create temp directory if it doesn't exist
        if not os.path.exists(UPLOAD_FOLDER):
            os.makedirs(UPLOAD_FOLDER)

        input_path = os.path.join(UPLOAD_FOLDER, file.filename)
        output_path = os.path.join(UPLOAD_FOLDER, f'{operation}ed_{file.filename}')
        
        # Save uploaded file
        file.save(input_path)
        
        # Load key with absolute path
        key_file = os.path.join(os.path.dirname(__file__), 'encryption_key.key')
        key = load_key(key_file)

        if operation == 'encrypt':
            encrypt_file(input_path, output_path, key)
        elif operation == 'decrypt':
            decrypt_file(input_path, output_path, key)
        else:
            return 'Invalid operation', 400

        # Send the file
        return send_file(output_path, as_attachment=True)
    
    except Exception as e:
        print(f"Error: {str(e)}")  # Add server-side logging
        return str(e), 500
        
    finally:
        # Cleanup
        try:
            if os.path.exists(input_path):
                os.remove(input_path)
            if os.path.exists(output_path):
                os.remove(output_path)
        except:
            pass

if __name__ == '__main__':
    app.run(debug=True)