from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User, RoleEnum, DepartmentEnum
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer

authorizer = Blueprint("auth", __name__)

@authorizer.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify(success=False, message="No input data provided"), 400
    first_name = data.get('first_name', '').strip()
    last_name = data.get('last_name', '').strip()
    email = data.get('email', '').lower()
    password = data.get('password1')
    check_password = data.get('password2')
    role = data.get('role', '').strip().lower()
    department = data.get("department", '').strip().lower()
    
    if password != check_password:
        return jsonify(success=False, message="Passwords do not match"), 400
    
    if not first_name or not last_name or not email or not role or not department:
        return jsonify(success=False, message="Missing required fields"), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify(success=False, message="Email already exists"), 400
    
    try:
        role_enum = RoleEnum(role)
    except ValueError:
        return jsonify(success=False, message="Invalid role"), 400
    try:
        department_enum = DepartmentEnum(department)
    except ValueError:
        return jsonify(success=False, message="Invalid department"), 400
    
    password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(
        first_name=first_name.capitalize(),
        last_name=last_name.capitalize(),
        email=email,
        password_hash=password_hash,
        role=role_enum,
        department=department_enum
    )
    db.session.add(new_user)
    db.session.commit()
    
    current_app.logger.info(f"{new_user.first_name} {new_user.last_name} has been registered.")
    return jsonify(success=True, message="User registered successfully"), 201


@authorizer.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    
    user = User.query.filter_by(email=email).first()
    if user and bcrypt.check_password_hash(user.password_hash, password):
        login_user(user)
        current_app.logger.info(f"{user.first_name} {user.last_name} logged in.")
        return jsonify(success=True, message=f"{user.first_name} has been logged in", user=user.serialize_basic()), 200
    return jsonify(success=False, message="Invalid credentials"), 401


@authorizer.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify(success=True, message="User logged out successfully"), 200


@authorizer.route('/hydrate_user', methods=['GET'])
@login_required
def hydrate_user():
    user_data = current_user.serialize_basic()
    return jsonify(success=True, user=user_data), 200
