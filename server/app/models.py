from app import db
from werkzeug.security import generate_password_hash
import json

class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    subject = db.Column(db.String(200))
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=db.func.now())

    def __repr__(self):
        return f"<ContactMessage {self.name}>"

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(20), default='customer')
    created_at = db.Column(db.DateTime, default=db.func.now())
    address = db.Column(db.Text)
    orders = db.relationship('Order', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        from werkzeug.security import check_password_hash
        return check_password_hash(self.password_hash, password)

    def is_admin(self):
        return self.role == 'admin'

    def __repr__(self):
        return f"<User {self.email}>"

class Category(db.Model):
    __tablename__ = 'categories'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False, unique=True)
    slug = db.Column(db.String(50), nullable=False, unique=True)  # URL-friendly version
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    # Relationship with products
    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'slug': self.slug,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f"<Category {self.name}>"

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    image_urls = db.Column(db.Text, nullable=True)  # Store as JSON string
    description = db.Column(db.Text)  # Added description field
    created_at = db.Column(db.DateTime, default=db.func.now())
    updated_at = db.Column(db.DateTime, default=db.func.now(), onupdate=db.func.now())
    
    # Foreign key to category
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)

    def set_image_urls(self, urls):
        self.image_urls = json.dumps(urls) if urls else None

    def get_image_urls(self):
        return json.loads(self.image_urls) if self.image_urls else []

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'price': float(self.price),
            'stock': self.stock,
            'image_urls': self.get_image_urls(),
            'description': self.description,
            'category_id': self.category_id,
            'category': self.category.slug if self.category else None,
            'category_name': self.category.name if self.category else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f"<Product {self.name}>"

class Order(db.Model):
    __tablename__ = 'orders'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    total_price = db.Column(db.Float, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.now())
    
    # Add relationship to product
    product = db.relationship('Product', backref='orders')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.product.name,
            'price': float(self.product.price),
            'quantity': self.quantity,
            'total': float(self.total_price),
            'image': self.product.get_image_urls()[0] if self.product.get_image_urls() else None,
            'status': self.status
        }

class GuestCart(db.Model):
    __tablename__ = 'guest_cart'

    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(80), nullable=False, index=True)

    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    quantity = db.Column(db.Integer, default=1)

    product = db.relationship('Product', backref='guest_items')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'name': self.product.name,
            'price': float(self.product.price),
            'quantity': self.quantity,
            'total': float(self.product.price * self.quantity),
            'image': self.product.get_image_urls()[0] if self.product.get_image_urls() else None
        }

class CollaborationRequest(db.Model):
    __tablename__ = 'collaboration_requests'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=db.func.now())

class BlogPost(db.Model):
    __tablename__ = 'blog_posts'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    thumbnail = db.Column(db.String(200))
    content = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, default=db.func.now())
    isRead = db.Column(db.Boolean, default=False)