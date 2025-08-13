from flask import Blueprint, request, jsonify
from app import db
from app.models import BlogPost
from datetime import datetime

bp = Blueprint('blog', __name__)

@bp.route('/api/blog', methods=['GET'])
def get_posts():
    posts = BlogPost.query.all()
    return jsonify([
        {
            'id': post.id,
            'title': post.title,
            'thumbnail': post.thumbnail,
            'content': post.content,
            'date': post.date.isoformat(),
            'isRead': post.isRead
        } for post in posts
    ])

@bp.route('/api/blog', methods=['POST'])
def create_post():
    data = request.get_json()
    if not all(k in data for k in ('title', 'content')):
        return jsonify({'error': 'Missing title or content'}), 400
    post = BlogPost(
        title=data['title'],
        thumbnail=data.get('thumbnail'),
        content=data['content'],
        date=datetime.fromisoformat(data.get('date', datetime.now().isoformat())),
        isRead=data.get('isRead', False)
    )
    db.session.add(post)
    db.session.commit()
    return jsonify({
        'message': 'Post created',
        'id': post.id,
        'title': post.title,
        'thumbnail': post.thumbnail,
        'content': post.content,
        'date': post.date.isoformat(),
        'isRead': post.isRead
    }), 201

@bp.route('/api/blog/<int:id>', methods=['PUT'])
def update_post(id):
    post = BlogPost.query.get_or_404(id)
    data = request.get_json()
    post.title = data.get('title', post.title)
    post.thumbnail = data.get('thumbnail', post.thumbnail)
    post.content = data.get('content', post.content)
    post.date = datetime.fromisoformat(data.get('date', post.date.isoformat()))
    post.isRead = data.get('isRead', post.isRead)
    db.session.commit()
    return jsonify({
        'message': 'Post updated',
        'id': post.id,
        'title': post.title,
        'thumbnail': post.thumbnail,
        'content': post.content,
        'date': post.date.isoformat(),
        'isRead': post.isRead
    })

@bp.route('/api/blog/<int:id>', methods=['DELETE'])
def delete_post(id):
    post = BlogPost.query.get_or_404(id)
    db.session.delete(post)
    db.session.commit()
    return jsonify({'message': 'Post deleted'})