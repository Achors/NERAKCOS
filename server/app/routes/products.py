from flask import Blueprint, request, jsonify
from app import db
from app.models import Product, Category

bp = Blueprint('products', __name__)

@bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': float(p.price),  # Ensure float for JSON
            'stock': p.stock,
            'category_id': p.category_id,
            'image_urls': p.get_image_urls(),  # Return array of URLs
            'created_at': p.created_at.isoformat()
        } for p in products]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'price', 'category_id')):
            return jsonify({"error": "Missing required fields (name, price, category_id)"}), 400

        new_product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock=data.get('stock', 0),
            category_id=data['category_id']
        )
        if 'image_urls' in data and isinstance(data['image_urls'], list):
            new_product.set_image_urls(data['image_urls'])
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product created!", "id": new_product.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500