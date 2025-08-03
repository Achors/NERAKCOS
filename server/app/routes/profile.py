from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from werkzeug.security import check_password_hash

bp = Blueprint('profile', __name__)

@bp.route('/profile', methods=['GET'])
def get_profile():
    try:
        user_id = request.args.get('user_id') 
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "address": user.address or "",
            "role": user.role,
            "created_at": user.created_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/profile', methods=['PUT'])
def update_profile():
    try:
        user_id = request.args.get('user_id')  
        if not user_id:
            return jsonify({"error": "Missing user_id parameter"}), 400

        user = User.query.get(user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        if not data or not any(k in data for k in ('name', 'address')):
            return jsonify({"error": "Missing fields to update (name, address)"}), 400

        if 'name' in data:
            user.name = data['name']
        if 'address' in data:
            user.address = data['address']

        db.session.commit()
        return jsonify({"message": "Profile updated successfully!", "id": user.id}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500