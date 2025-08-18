import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///nerakcos.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.urandom(24)
    UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'uploads')

class DevelopmentConfig(Config):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///nerakcos.db')
    PORT = 10000

class ProductionConfig(Config):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///nerakcos.db')
    PORT = os.environ.get('PORT', 5000)