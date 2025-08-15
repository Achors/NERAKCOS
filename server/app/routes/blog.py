import os
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
from app import db
from app.models import BlogPost
from datetime import datetime

bp = Blueprint('blog', __name__)

# File upload configuration
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

def allowed_file(filename):
    """Check if the uploaded file has an allowed extension"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@bp.route('/api/blog', methods=['GET'])
def get_posts():
    """Get all blog posts"""
    posts = BlogPost.query.order_by(BlogPost.date.desc()).all()
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
    """Create a new blog post"""
    data = request.get_json()
    
    # Validate required fields
    if not all(k in data for k in ('title', 'content')):
        return jsonify({'error': 'Missing title or content'}), 400
    
    try:
        # Parse date if provided, otherwise use current time
        post_date = datetime.fromisoformat(data.get('date', datetime.now().isoformat()))
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    
    post = BlogPost(
        title=data['title'],
        thumbnail=data.get('thumbnail'),
        content=data['content'],
        date=post_date,
        isRead=data.get('isRead', False)
    )
    
    try:
        db.session.add(post)
        db.session.commit()
        
        return jsonify({
            'message': 'Post created successfully',
            'id': post.id,
            'title': post.title,
            'thumbnail': post.thumbnail,
            'content': post.content,
            'date': post.date.isoformat(),
            'isRead': post.isRead
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to create post'}), 500

@bp.route('/api/blog/<int:id>', methods=['PUT'])
def update_post(id):
    """Update an existing blog post"""
    post = BlogPost.query.get_or_404(id)
    data = request.get_json()
    
    try:
        # Update fields if provided
        post.title = data.get('title', post.title)
        post.thumbnail = data.get('thumbnail', post.thumbnail)
        post.content = data.get('content', post.content)
        post.isRead = data.get('isRead', post.isRead)
        
        # Handle date update
        if 'date' in data:
            post.date = datetime.fromisoformat(data['date'])
        
        db.session.commit()
        
        return jsonify({
            'message': 'Post updated successfully',
            'id': post.id,
            'title': post.title,
            'thumbnail': post.thumbnail,
            'content': post.content,
            'date': post.date.isoformat(),
            'isRead': post.isRead
        })
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update post'}), 500

@bp.route('/api/blog/<int:id>', methods=['DELETE'])
def delete_post(id):
    """Delete a blog post"""
    post = BlogPost.query.get_or_404(id)
    
    try:
        # If the post has a thumbnail, optionally delete the file
        if post.thumbnail and post.thumbnail.startswith('/static/uploads/'):
            try:
                file_path = os.path.join(current_app.static_folder, 'uploads', 
                                       os.path.basename(post.thumbnail))
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                # Log the error but don't fail the deletion
                print(f"Warning: Could not delete image file {post.thumbnail}: {e}")
        
        db.session.delete(post)
        db.session.commit()
        
        return jsonify({'message': 'Post deleted successfully'})
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to delete post'}), 500

@bp.route('/api/blog/upload', methods=['POST'])
def upload_blog_image():
    """Upload an image file for blog posts"""
    # Check if file is in request
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400
    
    file = request.files['image']
    
    # Check if file was actually selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file size
    if request.content_length and request.content_length > MAX_FILE_SIZE:
        return jsonify({'error': 'File size too large (max 5MB)'}), 400
    
    # Validate file type and process upload
    if file and allowed_file(file.filename):
        try:
            # Create secure filename with timestamp and blog prefix
            original_filename = secure_filename(file.filename)
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            filename = f"blog_{timestamp}_{original_filename}"
            
            # Use the same upload folder as your existing upload system
            upload_folder = current_app.config.get('UPLOAD_FOLDER')
            if not upload_folder:
                upload_folder = os.path.join(current_app.root_path, 'static/uploads')
                os.makedirs(upload_folder, exist_ok=True)
            
            # Save file
            file_path = os.path.join(upload_folder, filename)
            file.save(file_path)
            
            # Return the URL path for the uploaded image
            image_url = f"/static/uploads/{filename}"
            
            return jsonify({
                'message': 'Blog image uploaded successfully',
                'image_url': image_url
            }), 200
            
        except Exception as e:
            return jsonify({'error': 'Failed to save image file'}), 500
    
    return jsonify({'error': 'Invalid file type. Please upload PNG, JPG, JPEG, GIF, or WebP files.'}), 400

@bp.route('/api/blog/<int:id>/toggle-read', methods=['PATCH'])
def toggle_read_status(id):
    """Toggle the read status of a blog post"""
    post = BlogPost.query.get_or_404(id)
    
    try:
        post.isRead = not post.isRead
        db.session.commit()
        
        return jsonify({
            'message': 'Read status updated',
            'id': post.id,
            'isRead': post.isRead
        })
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': 'Failed to update read status'}), 500

# Error handlers for this blueprint
@bp.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@bp.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500