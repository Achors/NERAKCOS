from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from flask_jwt_extended import jwt_required, get_jwt_identity, get_jwt

bp = Blueprint('profile', __name__)

@bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        current_user_id = int(get_jwt_identity()) 
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({"error": "User not found"}), 404

        # Optionally get role from claims if needed
        claims = get_jwt()
        role = claims.get("role", user.role)  # Fallback to DB if claim missing

        return jsonify({
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "address": user.address or "",
            "role": role,
            "created_at": user.created_at.isoformat()
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        current_user_id = int(get_jwt_identity())# Returns user.id (int)
        user = User.query.get(current_user_id)
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