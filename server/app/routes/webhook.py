from flask import Blueprint, request, jsonify, current_app
import stripe
import hmac
import hashlib
from app import db
from app.models import Order, GuestCart, Product

bp = Blueprint('webhook', __name__, url_prefix='/webhook')

@bp.route('/stripe', methods=['POST'])
def stripe_webhook():
    payload = request.data
    sig_header = request.headers.get('Stripe-Signature')
    endpoint_secret = current_app.config.get('STRIPE_WEBHOOK_SECRET')

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError:
        return jsonify(error="Invalid payload"), 400
    except stripe.error.SignatureVerificationError:
        return jsonify(error="Invalid signature"), 400

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        handle_payment_success(session)

    return jsonify(success=True), 200


def handle_payment_success(session):
    cart_id = session['metadata']['cart_id']
    user_id = session['metadata'].get('user_id')

    with current_app.app_context():
        if cart_id.startswith('user_'):
            user_id = int(cart_id.split('_')[1])
            orders = Order.query.filter_by(user_id=user_id, status='pending').all()
        else:
            session_id = cart_id.split('_', 1)[1]
            orders = GuestCart.query.filter_by(session_id=session_id).all()

        for item in orders:
            product = Product.query.get(item.product_id)
            if product:
                product.stock -= item.quantity
                db.session.delete(item)  # or update status to 'paid'
            else:
                db.session.delete(item)
        db.session.commit()