from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

upload_bp = Blueprint('upload', __name__)

def init_upload(app):
    # Configure upload folder using app context
    UPLOAD_FOLDER = os.path.join(app.root_path, 'static/uploads')
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)

@upload_bp.route('/upload', methods=['POST'])
def upload_images():
    try:
        if 'images' not in request.files:
            return jsonify({"error": "No images uploaded"}), 400

        files = request.files.getlist('images')
        uploaded_urls = []

        for file in files:
            if file and file.filename:
                filename = secure_filename(file.filename)
                file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)
                uploaded_urls.append(f'/static/uploads/{filename}')

        return jsonify({"urls": uploaded_urls}), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

from flask import current_app  