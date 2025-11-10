from flask import Blueprint, request, jsonify
from app import db
from app.models import GuestCart, Order, Product
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
import uuid

bp = Blueprint('cart', __name__)

# =============================
# HELPER: Get cart ID
# =============================
def get_cart_id():
    if current_user:
        return f"user_{current_user.id}"
    session_id = request.cookies.get('guest_session')
    if not session_id:
        session_id = str(uuid.uuid4())
    return f"guest_{session_id}"

# =============================
# HELPER: Get items
# =============================
def get_cart_items(cart_id):
    if cart_id.startswith('user_'):
        user_id = int(cart_id.split('_')[1])
        return Order.query.filter_by(user_id=user_id, status='pending').all()
    else:
        session_id = cart_id.split('_', 1)[1]
        return GuestCart.query.filter_by(session_id=session_id).all()

# =============================
# HELPER: Count
# =============================
def get_cart_count(cart_id):
    items = get_cart_items(cart_id)
    return sum(item.quantity for item in items)

# =============================
# MERGE GUEST → USER (on first access after login)
# =============================
def merge_guest_to_user(user_id, session_id):
    if not session_id:
        return
    guest_items = GuestCart.query.filter_by(session_id=session_id).all()
    if not guest_items:
        return

    for g in guest_items:
        existing = Order.query.filter_by(
            user_id=user_id,
            product_id=g.product_id,
            status='pending'
        ).first()
        if existing:
            existing.quantity += g.quantity
            existing.total_price = existing.product.price * existing.quantity
        else:
            order = Order(
                user_id=user_id,
                product_id=g.product_id,
                quantity=g.quantity,
                total_price=g.product.price * g.quantity,
                status='pending'
            )
            db.session.add(order)
        db.session.delete(g)
    db.session.commit()

# =============================
# ADD TO CART
# =============================
@bp.route('/cart', methods=['POST'])
def add_to_cart():
    from app.models import GuestCart, Order, Product

    data = request.get_json()
    if not data or 'product_id' not in data:
        return jsonify({"error": "product_id required"}), 400

    product = Product.query.get(data['product_id'])
    if not product:
        return jsonify({"error": "Product not found"}), 404
    if product.stock < data.get('quantity', 1):
        return jsonify({"error": "Out of stock"}), 400

    cart_id = get_cart_id()
    quantity = data.get('quantity', 1)

    # === MERGE ON FIRST LOGIN ACCESS ===
    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"  # Switch to user cart

    if cart_id.startswith('user_'):
        user_id = int(cart_id.split('_')[1])
        existing = Order.query.filter_by(user_id=user_id, product_id=product.id, status='pending').first()
        if existing:
            existing.quantity += quantity
            existing.total_price = existing.product.price * existing.quantity
        else:
            order = Order(
                user_id=user_id,
                product_id=product.id,
                quantity=quantity,
                total_price=product.price * quantity,
                status='pending'
            )
            db.session.add(order)
    else:
        session_id = cart_id.split('_', 1)[1]
        existing = GuestCart.query.filter_by(session_id=session_id, product_id=product.id).first()
        if existing:
            existing.quantity += quantity
        else:
            item = GuestCart(session_id=session_id, product_id=product.id, quantity=quantity)
            db.session.add(item)

    db.session.commit()

    response = jsonify({
        "message": "Added to cart",
        "cart_count": get_cart_count(cart_id)
    })
    if not current_user:
        session_id = cart_id.split('_', 1)[1]
        response.set_cookie(
            'guest_session',
            session_id,
            max_age=30*24*60*60,
            httponly=True,
            secure=True,           # ← MUST BE TRUE ON HTTPS (Render)
            samesite='None',       # ← CRITICAL FOR CROSS-SITE
            path='/'
        )
    return response, 200

# =============================
# GET CART
# =============================
@bp.route('/cart', methods=['GET'])
def get_cart():
    cart_id = get_cart_id()

    # === AUTO-MERGE ON LOGIN ===
    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"

    items = get_cart_items(cart_id)
    return jsonify([item.to_dict() for item in items]), 200

# =============================
# UPDATE QTY
# =============================
@bp.route('/cart/<int:item_id>', methods=['PUT'])
def update_cart(item_id):
    cart_id = get_cart_id()

    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"

    items = get_cart_items(cart_id)
    item = next((i for i in items if i.id == item_id), None)
    if not item:
        return jsonify({"error": "Item not in cart"}), 404

    data = request.get_json()
    new_qty = data.get('quantity')
    if not new_qty or new_qty < 1:
        return jsonify({"error": "Valid quantity required"}), 400

    item.quantity = new_qty
    if hasattr(item, 'total_price'):
        item.total_price = item.product.price * new_qty
    db.session.commit()

    return jsonify({"message": "Updated"}), 200

# =============================
# REMOVE ITEM
# =============================
@bp.route('/cart/<int:item_id>', methods=['DELETE'])
def remove_from_cart(item_id):
    cart_id = get_cart_id()

    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"

    items = get_cart_items(cart_id)
    item = next((i for i in items if i.id == item_id), None)
    if not item:
        return jsonify({"error": "Not found"}), 404

    db.session.delete(item)
    db.session.commit()
    return jsonify({"message": "Removed"}), 200

# =============================
# CHECKOUT
# =============================
@bp.route('/checkout', methods=['POST'])
@jwt_required(optional=True)
def checkout():
    cart_id = get_cart_id()

    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"

    items = get_cart_items(cart_id)
    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    data = request.get_json()
    shipping = data.get('shipping', {})
    payment_method = data.get('payment_method', 'cod')

    # Change status to 'paid'
    for item in items:
        item.status = 'paid'
        # Optionally save shipping info elsewhere
    db.session.commit()

    # Clear guest cookie
    response = jsonify({
        "message": "Order placed successfully",
        "order_id": items[0].id  # or create a parent order
    })
    if not current_user:
        response.set_cookie('guest_session', '', expires=0)
    return response, 200