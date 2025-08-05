from flask import Blueprint, request, jsonify
from app import db
from app.models import ContactMessage  # Reuse for simplicity

bp = Blueprint('collaborate', __name__)

@bp.route('/collaborate', methods=['POST'])
def collaborate_submit():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'email', 'message')):
            return jsonify({"error": "Missing required fields (name, email, message)"}), 400

        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            subject=data.get('subject', 'Collaboration Inquiry'),
            message=data['message']
        )
        db.session.add(new_message)
        db.session.commit()

        # PDF download
        return jsonify({"message": "Collaboration request received! PDF will be emailed soon.", "id": new_message.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500