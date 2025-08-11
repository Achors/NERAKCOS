from flask import Blueprint, request, jsonify
from app import db
from app.models import Category, User
from flask_jwt_extended import jwt_required, get_jwt_identity

bp = Blueprint('categories', __name__)

@bp.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = Category.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'description': c.description
        } for c in categories]), 200
    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500

@bp.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or not user.is_admin():
            return jsonify({"error": "Unauthorized: Admin access required"}), 403

        data = request.get_json()
        if not data or 'name' not in data:
            return jsonify({"error": "Missing required field (name)"}), 400

        new_category = Category(name=data['name'], description=data.get('description'))
        db.session.add(new_category)
        db.session.commit()

        return jsonify({"message": "Category created!", "id": new_category.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500