from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User, RoleEnum, DepartmentEnum, LocationEnum, TimeOffStatusEnum, Shift, Schedule, Availability, TimeOffRequest
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer
from datetime import time, date

deleter = Blueprint("delete", __name__)

@deleter.route("/user/<int:id>", methods=["DELETE"])
@login_required
def delete_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify(success=False, message="User not found."), 404
    
    db.session.delete(user)
    db.session.commit()
    return jsonify(success=True, message="User has been deleted."), 200

@deleter.route("/schedule/<int:id>", methods=["DELETE"])
@login_required
def delete_schedule(id):
    schedule_item = Schedule.query.get(id)
    if not schedule_item:
        return jsonify(success=False, message="Schedule not found."), 400
    
    db.session.delete(schedule_item)
    db.session.commit()
    return jsonify(success=True, message="Schedule has been deleted."), 200

@deleter.route("/shift/<int:id>", methods=["DELETE"])
@login_required
def delete_shift(id):
    shift = Shift.query.get(id)
    if not shift:
        return jsonify(success=False, message="Shift not found."), 400
    
    db.session.delete(shift)
    db.session.commit()
    return jsonify(success=True, message="Shift has been deleted."), 200

@deleter.route("/availability/<int:id>", methods=["DELETE"])
@login_required
def delete_availability(id):
    availability = Availability.query.get(id)
    if not availability:
        return jsonify(success=False, message="Availability not found."), 400
    
    db.session.delete(availability)
    db.session.commit()
    return jsonify(success=True, message="Availability has been deleted."), 200

@deleter.route("/time_off_request/<int:id>", methods=["DELETE"])
@login_required
def delete_time_off_request(id):
    time_off = TimeOffRequest.query.get(id)
    if not time_off:
        return jsonify(success=False, message="Request not found."), 400
    
    db.session.delete(time_off)
    db.session.commit()
    return jsonify(success=True, message="Request has been deleted."), 200