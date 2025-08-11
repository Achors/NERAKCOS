from flask import Blueprint, request, jsonify
from app import db
from app.models import Product, Category, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import uuid

bp = Blueprint('products', __name__)

# Configure upload folder (adjust path as needed)
UPLOAD_FOLDER = 'app/static/uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': float(p.price),
            'stock': p.stock,
            'category_id': p.category_id,
            'image_urls': p.get_image_urls(),
            'created_at': p.created_at.isoformat()
        } for p in products]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({"error": "Unauthorized: Admin access required"}), 403

        # Expect FormData with files
        if 'name' not in request.form or 'price' not in request.form or 'category_id' not in request.form:
            return jsonify({"error": "Missing required fields (name, price, category_id)"}), 400

        # Handle image uploads
        images = request.files.getlist('images')
        image_urls = []
        if images:
            for image in images:
                if image and allowed_file(image.filename):
                    filename = secure_filename(f"{uuid.uuid4()}_{image.filename}")  # Unique filename
                    image.save(os.path.join(UPLOAD_FOLDER, filename))
                    image_urls.append(f'/uploads/{filename}')

        new_product = Product(
            name=request.form['name'],
            description=request.form.get('description'),
            price=float(request.form['price']),
            stock=int(request.form.get('stock', 0)),
            category_id=int(request.form['category_id'])
        )
        if image_urls:
            new_product.set_image_urls(image_urls)

        db.session.add(new_product)
        db.session.commit()

        return jsonify({
            "message": "Product created!",
            "id": new_product.id,
            "image_urls": image_urls
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500