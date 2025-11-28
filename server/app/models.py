from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, Date, Time, func, desc
from sqlalchemy.orm import relationship
from datetime import datetime, time


from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from enum import Enum

db = SQLAlchemy()

# -----------------------
# Enums
# -----------------------
class TimeOffStatus(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"

# -----------------------
# Core Models
# -----------------------
class Role(db.Model):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True)
    name = Column(String(50), nullable=False, unique=True)

    employees = relationship("Employee", backref="role", lazy=True)
    shifts = relationship("Shift", backref="role", lazy=True)

class Location(db.Model):
    __tablename__ = "locations"
    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    address = Column(String(200))

    shifts = relationship("Shift", backref="location", lazy=True)

class Employee(db.Model):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    role_id = Column(Integer, ForeignKey("roles.id"))

    schedules = relationship("Schedule", backref="employee", lazy=True)
    availability = relationship("Availability", backref="employee", lazy=True)
    time_off_requests = relationship("TimeOffRequest", backref="employee", lazy=True)

class Shift(db.Model):
    __tablename__ = "shifts"
    id = Column(Integer, primary_key=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    role_id = Column(Integer, ForeignKey("roles.id"))
    location_id = Column(Integer, ForeignKey("locations.id"))

    schedules = relationship("Schedule", backref="shift", lazy=True)

class Schedule(db.Model):
    __tablename__ = "schedules"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shifts.id"), nullable=False)
    assigned_on = Column(DateTime, default=datetime.now())

class Availability(db.Model):
    __tablename__ = "availability"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday ... 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)

class TimeOffRequest(db.Model):
    __tablename__ = "time_off_requests"
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("employees.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255))
    status = Column(Enum(TimeOffStatus), default=TimeOffStatus.PENDING)

    