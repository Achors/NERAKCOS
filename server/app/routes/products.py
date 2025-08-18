from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import os
import uuid
from app import db
from app.models import Product, Category
from flask_jwt_extended import jwt_required, get_jwt_identity


bp = Blueprint('products', __name__)

# Helper function for file uploads
def allowed_file(filename):
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file):
    """Save uploaded file and return the URL"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        filename = str(uuid.uuid4()) + '_' + secure_filename(file.filename)
        
        # Create upload directory if it doesn't exist
        upload_dir = os.path.join(current_app.root_path, 'uploads', 'products')
        os.makedirs(upload_dir, exist_ok=True)
        
        # Save file
        filepath = os.path.join(upload_dir, filename)
        file.save(filepath)
        
        # Return URL path - matches your app's upload serving
        return f'/uploads/{filename}'
    return None

# Get all products
@bp.route('/products', methods=['GET'])
def get_products():
    try:
        # Get query parameters
        category_slug = request.args.get('category')
        
        # Base query
        query = Product.query
        
        # Filter by category if provided
        if category_slug:
            category = Category.query.filter_by(slug=category_slug).first()
            if category:
                query = query.filter_by(category_id=category.id)
        
        # Get all products (simplified - no pagination to match your frontend)
        products = query.all()
        
        return jsonify([product.to_dict() for product in products]), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get single product
@bp.route('/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        product = Product.query.get_or_404(product_id)
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create new product
@bp.route('/products', methods=['POST'])
@jwt_required()
def create_product():
    try:
        # Check if user is admin
        current_user_id = int(get_jwt_identity())
        from app.models import User
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get form data
        name = request.form.get('name')
        price = request.form.get('price')
        stock = request.form.get('stock')
        category_slug = request.form.get('category')
        description = request.form.get('description', '')
        
        # Validate required fields
        if not all([name, price, stock, category_slug]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Find category by slug
        category = Category.query.filter_by(slug=category_slug).first()
        if not category:
            return jsonify({'error': 'Invalid category'}), 400
        
        # Handle file uploads
        image_urls = []
        uploaded_files = request.files.getlist('images')
        
        for file in uploaded_files:
            if file and file.filename:
                file_url = save_uploaded_file(file)
                if file_url:
                    image_urls.append(file_url)
        
        # Create product
        product = Product(
            name=name,
            price=float(price),
            stock=int(stock),
            category_id=category.id,
            description=description
        )
        
        # Set image URLs
        product.set_image_urls(image_urls)
        
        # Save to database
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201
        
    except ValueError as e:
        return jsonify({'error': 'Invalid price or stock value'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Update product
@bp.route('/products/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    try:
        # Check if user is admin
        current_user_id = int(get_jwt_identity())
        from app.models import User
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        product = Product.query.get_or_404(product_id)
        
        # Get form data
        name = request.form.get('name')
        price = request.form.get('price')
        stock = request.form.get('stock')
        category_slug = request.form.get('category')
        description = request.form.get('description')
        
        # Update fields if provided
        if name:
            product.name = name
        if price:
            product.price = float(price)
        if stock:
            product.stock = int(stock)
        if description is not None:
            product.description = description
            
        if category_slug:
            category = Category.query.filter_by(slug=category_slug).first()
            if category:
                product.category_id = category.id
        
        # Handle new images if uploaded
        uploaded_files = request.files.getlist('images')
        if uploaded_files and any(f.filename for f in uploaded_files):
            image_urls = []
            for file in uploaded_files:
                if file and file.filename:
                    file_url = save_uploaded_file(file)
                    if file_url:
                        image_urls.append(file_url)
            
            # Add new images to existing ones or replace them
            existing_images = product.get_image_urls()
            replace_images = request.form.get('replace_images', 'false').lower() == 'true'
            
            if replace_images:
                product.set_image_urls(image_urls)
            else:
                all_images = existing_images + image_urls
                product.set_image_urls(all_images)
        
        db.session.commit()
        
        return jsonify(product.to_dict()), 200
        
    except ValueError as e:
        return jsonify({'error': 'Invalid price or stock value'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Delete product
@bp.route('/products/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    try:
        # Check if user is admin
        current_user_id = int(get_jwt_identity())
        from app.models import User
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        product = Product.query.get_or_404(product_id)
        
        # Delete associated image files
        image_urls = product.get_image_urls()
        for url in image_urls:
            try:
                # Convert URL to file path and delete
                if url.startswith('/uploads/'):
                    file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], url.split('/')[-1])
                    if os.path.exists(file_path):
                        os.remove(file_path)
            except Exception as e:
                print(f"Error deleting image file: {e}")
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Get all categories (for dropdown)
@bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([category.to_dict() for category in categories]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Create category (admin only)
@bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    try:
        # Check if user is admin
        current_user_id = int(get_jwt_identity())
        from app.models import User
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        data = request.get_json()
        name = data.get('name')
        slug = data.get('slug', name.lower().replace(' ', '-').replace('_', '-'))
        description = data.get('description', '')
        
        if not name:
            return jsonify({'error': 'Category name is required'}), 400
        
        # Check if category exists
        existing = Category.query.filter_by(slug=slug).first()
        if existing:
            return jsonify({'error': 'Category already exists'}), 400
        
        category = Category(
            name=name,
            slug=slug,
            description=description
        )
        
        db.session.add(category)
        db.session.commit()
        
        return jsonify(category.to_dict()), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500