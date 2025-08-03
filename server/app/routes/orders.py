from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, Product, User

bp = Blueprint('orders', __name__)

@bp.route('/orders', methods=['POST'])
def create_order():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('user_id', 'product_id', 'quantity')):
            return jsonify({"error": "Missing required fields (user_id, product_id, quantity)"}), 400

        user = User.query.get(data['user_id'])
        product = Product.query.get(data['product_id'])
        if not user or not product:
            return jsonify({"error": "User or product not found"}), 404
        if product.stock < data['quantity']:
            return jsonify({"error": "Insufficient stock"}), 400

        total = product.price * data['quantity']
        new_order = Order(user_id=data['user_id'], product_id=data['product_id'], quantity=data['quantity'], total=total)
        product.stock -= data['quantity']
        db.session.add(new_order)
        db.session.commit()

        return jsonify({"message": "Order placed successfully!", "id": new_order.id, "total": total}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/orders', methods=['GET'])
def get_orders():
    try:
        orders = Order.query.all()
        return jsonify([{
            'id': o.id,
            'user_id': o.user_id,
            'product_id': o.product_id,
            'quantity': o.quantity,
            'total': o.total,
            'status': o.status,
            'created_at': o.created_at.isoformat()
        } for o in orders]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500