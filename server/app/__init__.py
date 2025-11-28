from flask import Flask, send_from_directory
from config import Config
from app.extensions import db, migrate, login_manager, cors, mail, bcrypt
from app.logger import setup_logger

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    
    #log setup
    logger = setup_logger("schedules")
    app.logger.handlers = logger.handlers
    app.logger.setLevel(logger.level)
    
    app.logger.info("Team Portal has been intialized")

    # Initialize extensions here (e.g., database, migrations)
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    cors.init_app(app)
    mail.init_app(app)
    bcrypt.init_app(app)
    

    # Register blueprints here
    from app.api import api_bp
    app.register_blueprint(api_bp)
    
    @app.route("/uploads/<path:filename>", methods=["GET"])
    def uploaded_file(filename):
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    
    
    # User loader for Flask-Login
    from app.models import User
    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    return app