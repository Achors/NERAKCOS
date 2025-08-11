from flask import Blueprint, request, jsonify
from app import db
from app.models import Order, Product, User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('orders', __name__)

@bp.route('/orders', methods=['POST'])
@jwt_required()
def create_order():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data or not all(k in data for k in ('product_id', 'quantity')):
            return jsonify({"error": "Missing required fields (product_id, quantity)"}), 400

        product = Product.query.get(data['product_id'])
        if not product:
            return jsonify({"error": "Product not found"}), 404
        if product.stock < data['quantity']:
            return jsonify({"error": "Insufficient stock"}), 400

        total_price = product.price * data['quantity']
        new_order = Order(
            user_id=current_user_id,
            product_id=data['product_id'],
            quantity=data['quantity'],
            total_price=total_price,
            status='pending'
        )
        product.stock -= data['quantity']
        db.session.add(new_order)
        db.session.commit()

        return jsonify({
            "message": "Item added to cart!",
            "id": new_order.id,
            "total_price": total_price
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/orders', methods=['GET'])
@jwt_required()
def get_orders():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({"error": "Unauthorized: Admin access required"}), 403

        orders = Order.query.all()
        return jsonify([{
            'id': o.id,
            'user_id': o.user_id,
            'product_id': o.product_id,
            'product_name': o.product.name,
            'quantity': o.quantity,
            'total_price': float(o.total_price),
            'status': o.status,
            'created_at': o.created_at.isoformat()
        } for o in orders]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/orders/<int:order_id>', methods=['PUT'])
@jwt_required()
def update_order_status(order_id):
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        order = Order.query.get(order_id)
        if not order or (not user.is_admin() and order.user_id != current_user_id):
            return jsonify({"error": "Order not found or unauthorized"}), 404

        data = request.get_json()
        if not data or 'status' not in data:
            return jsonify({"error": "Missing status field"}), 400
        if data['status'] not in ['pending', 'completed', 'cancelled']:
            return jsonify({"error": "Invalid status"}), 400

        order.status = data['status']
        db.session.commit()
        return jsonify({
            "message": "Order status updated!",
            "id": order.id,
            "status": order.status
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500