from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask import signals
from config import DevelopmentConfig, ProductionConfig
import os

# Initialize extensions outside create_app to avoid circular imports
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Replace with env var in production
    app.config['UPLOAD_FOLDER'] = os.path.join(app.root_path, 'uploads')  # Define upload folder

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": os.environ.get('FRONTEND_URL', '*')}}, supports_credentials=True)

    # Import blueprints after app initialization
    from app.routes.contact import bp as contact_bp
    from app.routes.auth import bp as auth_bp
    from app.routes.products import bp as products_bp
    from app.routes.home import bp as home_bp
    from app.routes.orders import bp as orders_bp
    from app.routes.profile import bp as profile_bp
    from app.routes.blog import bp as blog_bp
    from app.routes.collaborate import bp as collaborate_bp
    from app.routes.categories import bp as categories_bp, initialize_default_categories
    from app.routes.upload import upload_bp, init_upload

    app.register_blueprint(contact_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(blog_bp, url_prefix='/api')
    app.register_blueprint(home_bp)  # No /api prefix for home
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(collaborate_bp, url_prefix='/api')
    app.register_blueprint(categories_bp, url_prefix='/api')
    app.register_blueprint(upload_bp, url_prefix='/api')

    # Initialize upload configuration
    init_upload(app)

    # JWT Configuration - FIXED VERSION
    @jwt.user_identity_loader
    def user_identity_loader(user):
        # If user is already an ID (int), return it directly
        if isinstance(user, int):
            return str(user)
        # If user is a User object, return its ID
        return str(user.id)

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        from app.models import User  # Import inside to avoid circular imports
        identity = jwt_data["sub"]  # 'sub' is the user ID from the token
        user = User.query.get_or_404(int(identity))  # Raise 404 if not found
        return user  # Return User object

    # Add static file serving for uploads
    @app.route('/uploads/<filename>')
    def uploaded_file(filename):
        upload_dir = os.path.join(app.config['UPLOAD_FOLDER'], 'products')  # server/app/uploads/products
        print(f"Looking for file in: {upload_dir}, filename: {filename}") 
        try:
            return send_from_directory(upload_dir, filename)
        except FileNotFoundError:
            print(f"File not found: {filename} in {upload_dir}") 
            return "File not found", 404

    # Initialize default categories on first app request using signal
    def initialize_categories():
        with app.app_context():
            initialize_default_categories()

    with app.app_context():
        initialize_categories()

    return app