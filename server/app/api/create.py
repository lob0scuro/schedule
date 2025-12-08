from flask import Blueprint, jsonify, request, current_app
from flask_login import login_user, logout_user, current_user, login_required
from app.extensions import db, bcrypt
from app.models import User, RoleEnum, DepartmentEnum, LocationEnum, TimeOffStatusEnum, Shift, Schedule, Availability, TimeOffRequest
from flask_mailman import EmailMessage
from itsdangerous import URLSafeTimedSerializer
from datetime import time, date

creator = Blueprint("create", __name__)

def str_to_time(s):
    if not s:
        return None
    h, m = map(int, s.split(":"))
    return time(hour=h, minute=m)

#--------------------
#   CREATE A NEW SHIFT BLOCK
#--------------------
@creator.route("/shift", methods=["POST"])
@login_required
def create_shift():
    data = request.get_json()
    start_str = data.get("start_time")
    end_str = data.get("end_time")
    title = data.get("title")
    
    if not start_str or not end_str:
        off = Shift(title=title)
        db.session.add(off)
        db.session.commit()
        return jsonify(success=True, message="New shift created!"), 201
    
    try:
        start_time = time.fromisoformat(start_str)
        end_time = time.fromisoformat(end_str)
    except ValueError:
        return jsonify(success=False, message="Invalid Time Format"), 400
    try:
        new_shift = Shift(title=title.title(), start_time=start_time, end_time=end_time)
        
        db.session.add(new_shift)
        db.session.commit()
        return jsonify(success=True, message="New shift created!"), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[SHIFT CREATION ERROR]: {e}")
        return jsonify(success=False, message="There was an error when adding new shift."), 500
    
    
#--------------------
#   CREATE A NEW SCHEDULE ITEM
#--------------------
@creator.route("/schedule", methods=["POST"])
@login_required
def create_schedule_item():
    data = request.get_json()
    user_id = data.get("user_id")
    shift_id = data.get("shift_id")
    shift_date_str = data.get("shift_date")
    location_str = data.get("location")
    
    if not all([user_id, shift_date_str, shift_id, location_str]):
        return jsonify(success=False, message="Missing required fields"), 400
    
    try:
        location = LocationEnum(location_str.lower())
    except ValueError:
        return jsonify(success=False, message="Invalid location"), 400
    
    try:
        shift_date_obj = date.fromisoformat(shift_date_str)
    except ValueError:
        return jsonify(success=False, message="Invalid date format. Use YYYY-MM-DD"), 400
    
    if not User.query.get(user_id):
        return jsonify(success=False, message="User not found"), 404
    if not Shift.query.get(shift_id):
        return jsonify(success=False, message="Shift not found"), 404
    
    existing = Schedule.query.filter_by(user_id=user_id, shift_id=shift_id, shift_date=shift_date_obj).first()
    if existing:
        return jsonify(success=False, message="Schedule conflict."), 400
    
    try:
        schedule_item = Schedule(
            user_id=user_id,
            shift_id=shift_id,
            shift_date=shift_date_obj,
            location=location
        )
        db.session.add(schedule_item)
        db.session.commit()
        return jsonify(success=True, message="Schedule submitted!", schedule=schedule_item.serialize()), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[SCHEDULE ERROR]: {e}")
        return jsonify(success=False, message="There was an error when making new schedule item."), 500
        


#--------------------
#   BULK SCHEDULE COMMIT
#--------------------
@creator.route("/bulk_schedule", methods=["POST"])
@login_required
def create_bulk_schedule():
    data = request.get_json()
    schedules = data.get("schedules")
    
    if not schedules:
        return jsonify(success=False, message="No schedules provided"), 400
    
    try:
        for item in schedules:
            user_id = item.get("user_id")
            shift_id = item.get("shift_id")
            shift_date_str = item.get("shift_date")
            location_str = item.get("location")
            
            custom_start = str_to_time(item.get("custom_start_time"))
            custom_end = str_to_time(item.get("custom_end_time"))
            
            if not all([user_id, shift_id, shift_date_str, location_str]):
                raise ValueError("Missing required fields")
            
            shift_date = date.fromisoformat(shift_date_str)
            location = LocationEnum(location_str.lower())
            
            exists = Schedule.query.filter_by(
                user_id=user_id,
                shift_date=shift_date
            ).first()
            
            if exists:
                exists.shift_id = shift_id
                exists.location = location              
                exists.custom_start_time = custom_start
                exists.custom_end_time = custom_end
                continue
            
            schedule_item = Schedule(
                user_id=user_id,
                shift_id=shift_id,
                shift_date=shift_date,
                location=location, 
                custom_start_time=custom_start,
                custom_end_time=custom_end
            )
            db.session.add(schedule_item)
        db.session.commit()
        return jsonify(success=True, message="Shifts have been submitted!"), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[BULK SCHEDULE ERROR]: {e}")
        return jsonify(success=False, message=str(e)), 500
    
    
@creator.route("/schedule_note/<int:id>", methods=["POST"])
@login_required
def add_schedule_note(id):
    try:
        schedule = Schedule.query.get(id)
        if not schedule:
            return jsonify(success=False, message="Schedule not found"), 400
        data = request.get_json()
        content = data.get("note")
        if not content:
            return jsonify(success=False, message="No message in payload"), 400
        schedule.note = content
        db.session.commit()
        return jsonify(success=True, message="Note added to scheduled shift"), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[SCHEDULE NOTE ERROR]: {e}")
        return jsonify(success=False, message="There was an error when submitting schedule note."), 500


#--------------------
#   CREATE A NEW AVAILABILITY BLOCK
#--------------------
@creator.route("/availability", methods=["POST"])
@login_required
def create_availability_slot():
    data = request.get_json()
    user_id = data.get("user_id")
    day_of_week = data.get("day_of_week") #0 indexed
    start_str = data.get("start_time")
    end_str = data.get("end_time")
    
    if not all([user_id, day_of_week is not None, start_str, end_str]):
        return jsonify(success=False, message="Missing required fields"), 400
    
    if not User.query.get(user_id):
        return jsonify(success=False, message="User not found"), 404
    
    try:
        start_time = time.fromisoformat(start_str)
        end_time = time.fromisoformat(end_str)
    except ValueError:
        return jsonify(success=False, message="Invalid Time Format"), 400
    
    if start_time >= end_time:
        return jsonify(success=False, message="Start time must be before end time"), 400
    
    existing = Availability.query.filter(
        Availability.user_id==user_id,
        Availability.day_of_week==day_of_week,
        Availability.start_time<end_time,
        Availability.end_time>start_time,
    ).first()
    if existing:
        return jsonify(success=False, message="Availability slot already exists."), 400
    
    
    try:
        available_on = Availability(
            user_id=user_id,
            day_of_week=day_of_week,
            start_time=start_time,
            end_time=end_time
        )
        db.session.add(available_on)
        db.session.commit()
        return jsonify(success=True, message="Availability has been updated!"), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[AVAILABILITY ERROR]: {e}")
        return jsonify(success=False, message="There was an error when submitting availability"), 500
    


#--------------------
#   CREATE A NEW TIME OFF REQUEST
#--------------------    
@creator.route("/time_off_request", methods=["POST"])
@login_required
def time_off_request():
    data = request.get_json()
    start_str = data.get("start_date")
    end_str = data.get("end_date")
    reason = data.get("reason")
    
    try:
        start_date = date.fromisoformat(start_str)
        end_date = date.fromisoformat(end_str)
    except ValueError:
        return jsonify(success=False, message="Invalid date format. Use YYYY-MM-DD"), 400
    
    exists = TimeOffRequest.query.filter(
        TimeOffRequest.user_id == current_user.id,
        TimeOffRequest.start_date <= end_date,
        TimeOffRequest.end_date >= start_date
    ).first()
    if exists:
        return jsonify(success=False, message="This user already has a request off for this date."), 400
    
    try:
        time_off = TimeOffRequest(
            user_id=current_user.id,
            start_date=start_date,
            end_date=end_date,
            reason=reason,
        )
        db.session.add(time_off)
        db.session.commit()
        return jsonify(success=True, message="Time off has been submitted for approval"), 201
    except Exception as e:
        db.session.rollback()
        current_app.logger.error(f"[TIME OFF REQUEST ERROR]: {e}")
        return jsonify(success=False, message="There was an error when submitting time off request."), 500
        
    