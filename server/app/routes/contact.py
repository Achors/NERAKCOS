from flask import Blueprint, request, jsonify
from app import db
from app.models import ContactMessage

bp = Blueprint('contact', __name__)

@bp.route('/contact', methods=['POST'])
def contact_submit():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'email', 'message')):
            return jsonify({"error": "Missing required fields (name, email, message)"}), 400

        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            subject=data.get('subject', 'No Subject'),
            message=data['message']
        )
        db.session.add(new_message)
        db.session.commit()

        return jsonify({"message": "Submission received, thank you!", "id": new_message.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500