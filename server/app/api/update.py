from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User, RoleEnum, DepartmentEnum, LocationEnum, TimeOffStatusEnum, Shift, Schedule, Availability, TimeOffRequest
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer
from datetime import time, date

updator = Blueprint("update", __name__)

@updator.route("/time_off_request/<int:id>/<status>", methods=["PATCH"])
@login_required
def update_time_off_status(id, status):
    if current_user.role not in [RoleEnum.ADMIN, RoleEnum.SCHEDULER]:
        return jsonify(success=False, message="Unauthorized"), 403
    
    status = status.lower()    
    time_off_request = TimeOffRequest.query.get(id)
    
    if not time_off_request:
        return jsonify(success=False, message="Request not found"), 404
    
    try:
        status = TimeOffStatusEnum(status)
    except ValueError:
        return jsonify(success=False, message="Invalid request status"), 400
    
    time_off_request.status = status
    db.session.commit()
    return jsonify(success=True, message="Status updated!"), 200


@updator.route("/user/<int:id>", methods=["PATCH"])
@login_required
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify(success=False, message="User not found."), 404
    
    if current_user.role != RoleEnum.ADMIN and current_user.id != user.id:
        return jsonify(success=False, message="Unauthorized"), 403
    
    data = request.get_json()
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    role = data.get("role")
    department = data.get("department")
    
    if first_name:
        user.first_name = first_name.strip().capitalize()
    if last_name:
        user.last_name = last_name.strip().capitalize()
    if email:
        user.email = email.strip().lower()
        if User.query.filter(User.email == email, User.id != user.id).first():
            return jsonify(success=False, message="Email already exists"), 400
    if role:
        try:
            user.role = RoleEnum(role.lower())
        except ValueError:
            return jsonify(success=False, message="Invalid role."), 400
    if department:
        try:
            user.department = DepartmentEnum(department.lower())
        except ValueError:
            return jsonify(success=False, message="Invalid department"), 400
    
    db.session.commit()
    return jsonify(success=True, message="User has been updated!", user=user.serialize_basic()), 200
            
