from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, current_user
from app import db
from app.models import Order, GuestCart, Product
import stripe
import os

bp = Blueprint('checkout', __name__, url_prefix='/api')

# Reuse your cart helpers
from app.routes.cart import get_cart_id, get_cart_items, merge_guest_to_user

@bp.route('/create-checkout-session', methods=['POST'])
@jwt_required(optional=True)
def create_checkout_session():
    cart_id = get_cart_id()

    # Merge guest cart if user logged in
    if current_user and cart_id.startswith('guest_'):
        session_id = cart_id.split('_', 1)[1]
        merge_guest_to_user(current_user.id, session_id)
        cart_id = f"user_{current_user.id}"

    items = get_cart_items(cart_id)
    if not items:
        return jsonify({"error": "Cart is empty"}), 400

    data = request.get_json() or {}
    shipping = data.get('shipping', {})

    try:
        line_items = []
        for item in items:
            product = Product.query.get(item.product_id)
            if not product:
                continue
            line_items.append({
                'price_data': {
                    'currency': 'eur',
                    'product_data': {
                        'name': product.name,
                        'images': product.get_image_urls()[:1] or [],
                    },
                    'unit_amount': int(product.price * 100),
                },
                'quantity': item.quantity,
            })

        # Add shipping as line item
        line_items.append({
            'price_data': {
                'currency': 'eur',
                'product_data': { 'name': 'Shipping' },
                'unit_amount': 1000,  # €10.00
            },
            'quantity': 1,
        })

        # THIS IS THE LINE YOU ASKED ABOUT
        session = stripe.checkout.Session.create(
            payment_method_types=['card', 'ideal'], 
            line_items=line_items,
            mode='payment',
            success_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/order-success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{os.getenv('FRONTEND_URL', 'http://localhost:5173')}/checkout",
            metadata={'cart_id': cart_id},
            shipping_address_collection={'allowed_countries': ['NL', 'DE', 'BE', 'AT', 'ES', 'IT']},
            phone_number_collection={'enabled': True},
        )

        return jsonify({'id': session.id}), 200

    except Exception as e:
        current_app.logger.error(f"Stripe error: {e}")
        return jsonify({'error': 'Payment failed'}), 500