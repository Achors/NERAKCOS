from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import DevelopmentConfig, ProductionConfig

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_class=DevelopmentConfig):
    app = Flask(__name__)
    app.config.from_object(config_class)
    app.config["JWT_SECRET_KEY"] = "super-secret-key"

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

    from app.routes.contact import bp as contact_bp
    from app.routes.auth import bp as auth_bp
    from app.routes.products import bp as products_bp
    from app.routes.home import bp as home_bp
    from app.routes.orders import bp as orders_bp
    from app.routes.profile import bp as profile_bp
    from app.routes.collaborate import bp as collaborate_bp
    from app.routes.categories import bp as categories_bp
    from app.routes.upload import upload_bp, init_upload  # Import and init

    app.register_blueprint(contact_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(home_bp)
    app.register_blueprint(orders_bp, url_prefix='/api')
    app.register_blueprint(profile_bp, url_prefix='/api')
    app.register_blueprint(collaborate_bp, url_prefix='/api')
    app.register_blueprint(categories_bp, url_prefix='/api')
    app.register_blueprint(upload_bp, url_prefix='/api')

    # Initialize upload configuration
    init_upload(app)

    @jwt.user_identity_loader
    def user_identity_lookup(user):
        return user

    @jwt.user_lookup_loader
    def user_lookup_callback(_jwt_header, jwt_data):
        identity = jwt_data["sub"]
        return User.query.get(identity)

    with app.app_context():
        db.create_all()

    return app