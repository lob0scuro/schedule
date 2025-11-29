from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User, RoleEnum, DepartmentEnum, LocationEnum, TimeOffStatusEnum, Shift, Schedule, Availability, TimeOffRequest
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer
from datetime import time, date

reader = Blueprint("read", __name__)


#------------------
#   USERS QUERY
#------------------
@reader.route("/user/<int:id>", methods=["GET"])
@login_required
def get_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify(success=False, message="User not found"), 404
    return jsonify(success=True, user=user.serialize()), 200

@reader.route("/get_users", methods=["GET"])
@login_required
def get_users():
    users = User.query.all()
    if not users:
        return jsonify(success=False, message="Users not found"), 404
    return jsonify(success=True, users=[u.serialize_basic() for u in users]), 200

@reader.route("department/<department>", methods=["GET"])
@login_required
def get_department(department):
    try:
        department = DepartmentEnum(department.lower())
    except ValueError:
        return jsonify(success=False, message="Invalid Department."), 400
    users = User.query.filter_by(department=department).all()
    if not users:
        return jsonify(success=False, message="User in that department not found."), 404
    return jsonify(success=True, department=[u.serialize_basic() for u in users]), 200



#------------------
#   SHIFT QUERY
#------------------
@reader.route("/shift/<int:id>", methods=["GET"])
@login_required
def get_shift(id):
    shift = Shift.query.get(id)
    if not shift:
        return jsonify(success=False, message="Shift not found"), 404
    return jsonify(success=True, shift=shift.serialize()), 200

@reader.route("/shifts", methods=["GET"])
@login_required
def get_shifts():
    shifts = Shift.query.all()
    if not shifts:
        return jsonify(success=False, message="Shifts not found"), 404
    return jsonify(success=True, shifts=[s.serialize_basic() for s in shifts]), 200



#------------------
#   SCHEDULE QUERY
#------------------
@reader.route("/schedule/<int:id>", methods=["GET"])
@login_required
def get_schedule(id):
    schedule = Schedule.query.get(id)
    if not schedule:
        return jsonify(success=False, message="Schedule not found"), 404
    return jsonify(success=True, schedule=schedule.serialize()), 200

@reader.route("/schedules", methods=["GET"])
@login_required
def get_schedules():
    schedules = Schedule.query.all()
    if not schedules:
        return jsonify(success=False, message="Schedules not found"), 404
    return jsonify(success=True, schedules=[s.serialize_basic() for s in schedules]), 200



#------------------
#   AVAILABILITY QUERY
#------------------
@reader.route("/availability/<int:id>", methods=["GET"])
@login_required
def get_availability(id):
    availability = Availability.query.get(id)
    if not availability:
        return jsonify(success=False, message="Availability not found"), 404
    return jsonify(success=True, availability=availability.serialize()), 200

@reader.route("/schedules", methods=["GET"])
@login_required
def get_schedules():
    availabilities = Availability.query.all()
    if not availabilities:
        return jsonify(success=False, message="Availabilities not found"), 404
    return jsonify(success=True, availabilities=[a.serialize_basic() for a in availabilities]), 200



#------------------
#   TIME OFF QUERY
#------------------
@reader.route("/time_off_request/<int:id>", methods=["GET"])
@login_required
def get_tim_off_request(id):
    time_off_request = TimeOffRequest.query.get(id)
    if not time_off_request:
        return jsonify(success=False, message="Request not found"), 404
    return jsonify(success=True, time_off_request=time_off_request.serialize()), 200

@reader.route("/time_off_requests", methods=["GET"])
@login_required
def get_time_off_requests():
    time_off_requests = TimeOffRequest.query.all()
    if not time_off_requests:
        return jsonify(success=False, message="Requests not found"), 404
    return jsonify(success=True, time_off_requests=[t.serialize_basic() for t in time_off_requests]), 200