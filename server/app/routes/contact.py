from flask import Blueprint, request, jsonify
from app import db, mail
from app.models import ContactMessage
from flask_mail import Message

bp = Blueprint('contact', __name__)

@bp.route('/contact', methods=['POST'])
def submit_contact():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ('name', 'email', 'subject', 'message')):
            return jsonify({"error": "Missing required fields"}), 400

        # Save to DB
        new_message = ContactMessage(
            name=data['name'],
            email=data['email'],
            subject=data['subject'],
            message=data['message']
        )
        db.session.add(new_message)
        db.session.commit()

        # Send email notification
        msg = Message(
            subject=f"New Contact Form Submission: {data['subject']}",
            recipients=['alocastlimited@gmail.com'],  # Your email
            body=f"Name: {data['name']}\nEmail: {data['email']}\nMessage: {data['message']}"
        )
        mail.send(msg)

        return jsonify({"message": "Submission received!", "id": new_message.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Server error: {str(e)}"}), 500