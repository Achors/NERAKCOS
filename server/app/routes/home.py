from flask import Blueprint, jsonify

bp = Blueprint('home', __name__)

@bp.route('/', methods=['GET'])
def welcome():
    return jsonify({"message": "Welcome to NERAKCOS backend! You're on the right track!"}), 200