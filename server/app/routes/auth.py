from flask import Blueprint, request, jsonify
from app import db
from app.models import User
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint('auth', __name__)

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('email', 'password', 'name')):
            return jsonify({"error": "Missing required fields (email, password, name)"}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({"error": "Email already registered"}), 400

        role = data.get('role', 'customer')
        if role not in ['customer', 'admin']:
            return jsonify({"error": "Invalid role"}), 400

        new_user = User(email=data['email'], name=data['name'], role=role)
        new_user.set_password(data['password'])
        db.session.add(new_user)
        db.session.commit()

        return jsonify({"message": "User registered successfully!", "id": new_user.id, "role": role}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('email', 'password')):
            return jsonify({"error": "Missing required fields (email, password)"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not user.check_password(data['password']):  # Use the model method
            return jsonify({"error": "Invalid credentials"}), 401

        access_token = create_access_token(identity=user.id, additional_claims={"role": user.role})

        return jsonify({
            "message": "Login successful!",
            "access_token": access_token,
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "role": user.role
        }), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    return jsonify({"error": "Use /api/profile endpoint from profile blueprint"}), 404

@bp.route('/reset-password', methods=['POST'])
def reset_password():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({"error": "Missing email field"}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        reset_token = "temp_reset_token"  # Replace with real token logic
        return jsonify({"message": "Password reset token generated!", "token": reset_token, "email": user.email}), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500