from flask import Blueprint, request, jsonify
from app import db
from app.models import Product

bp = Blueprint('products', __name__)

@bp.route('/products', methods=['GET'])
def get_products():
    try:
        products = Product.query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price,
            'stock': p.stock,
            'category': p.category,
            'image_url': p.image_url,
            'created_at': p.created_at.isoformat()
        } for p in products]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/products', methods=['POST'])
def create_product():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'price', 'stock')):
            return jsonify({"error": "Missing required fields (name, price, stock)"}), 400

        new_product = Product(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            stock=data['stock'],
            category=data.get('category'),
            image_url=data.get('image_url')
        )
        db.session.add(new_product)
        db.session.commit()

        return jsonify({"message": "Product created!", "id": new_product.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500