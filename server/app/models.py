from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, Date, Time, Enum as sqlEnum, func, desc, and_ 
from sqlalchemy.orm import relationship, foreign
from datetime import datetime, time
from enum import Enum


class DepartmentEnum(Enum):
    SALES = "sales"
    SERVICE = "service"
    CLEANER = "cleaner"
    TECHNICIAN = "technician"
    OFFICE = "office"
    
class TimeOffStatusEnum(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    
class LocationEnum(Enum):
    LAKE_CHARLES = "lake_charles"
    JENNINGS = "jennings"
    LAFAYETTE = "lafayette"
    
class RoleEnum(Enum):
    ADMIN = "admin"
    SCHEDULER = "scheduler"
    EMPLOYEE = "employee"

class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(256), nullable=False, unique=True)
    password_hash = Column(String(256), nullable=False)
    role = Column(sqlEnum(RoleEnum), default=RoleEnum.EMPLOYEE, nullable=False)
    department = Column(sqlEnum(DepartmentEnum), nullable=False)
    
    schedules = relationship("Schedule", backref="user", lazy=True)
    availability = relationship("Availability", backref="user", lazy=True)
    time_off_requests = relationship("TimeOffRequest", backref="user", lazy=True)
    
    def current_weeks_schedule(self, start, end):
        schedules = Schedule.query.filter(
            Schedule.user_id == self.id,
            Schedule.shift_date.between(start, end)
        ).order_by(Schedule.shift_date.asc()).all()
        return [s.serialize() for s in schedules]
    
    def serialize_basic(self):
        return {
           "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role.value,
            "department": self.department.value, 
        }
    
    def serialize(self):
        return {
            "id": self.id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "role": self.role.value,
            "department": self.department.value,
            "schedules": [s.serialize() for s in self.schedules],
            "availability": [a.serialize() for a in self.availability],
            "time_off_requests": [t.serialize() for t in self.time_off_requests]
        }
    

class Shift(db.Model):
    __tablename__ = "shifts"
    
    #Shift ID for Custom shifts is 9998; shift ID for off is 9999
    id = Column(Integer, primary_key=True)
    title = Column(String(100), nullable=False)
    start_time = Column(Time, nullable=True)
    end_time = Column(Time, nullable=True)
    
    schedules = relationship("Schedule", backref="shift", lazy=True)
    
    def duration(self):
        if not self.start_time or not self.end_time:
            return None
        
        start_dt = datetime.combine(datetime.today(), self.start_time)
        end_dt = datetime.combine(datetime.today(), self.end_time)
        
        return (end_dt - start_dt).total_seconds() / 3600
    
    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "start_time": self.start_time.strftime("%H:%M") if self.start_time else None,
            "end_time": self.end_time.strftime("%H:%M") if self.end_time else None,
        }
        
    def serialize_basic(self):
        return {
            "id": self.id,
            "title": self.title,
            "start_time": self.start_time.strftime("%H:%M") if self.start_time else None,
            "end_time": self.end_time.strftime("%H:%M") if self.end_time else None,
        }
    
    
class Schedule(db.Model):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("shifts.id"), nullable=False)
    shift_date = Column(Date, nullable=False)
    location = Column(sqlEnum(LocationEnum), nullable=False)
    custom_start_time = Column(Time, nullable=True)
    custom_end_time = Column(Time, nullable=True)
    note = Column(Text, nullable=True)
    
    def serialize(self):
        start = self.custom_start_time or self.shift.start_time
        end = self.custom_end_time or self.shift.end_time
        return {
            "id": self.id,
            "user_id": self.user_id,
            "shift_id": self.shift_id,
            "shift_date": self.shift_date.isoformat(),
            "location": self.location.value,
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "department": self.user.department.value
            },
            "shift": {
                "start_time": start.strftime("%H:%M") if start else None,
                "end_time": end.strftime("%H:%M") if end else None
            },
            "note": self.note 
        }
    
    
class Availability(db.Model):
    __tablename__ = "availability"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "day_of_week": self.day_of_week,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "department": self.user.department.value
            }
        }
    

class TimeOffRequest(db.Model):
    __tablename__ = "time_off_requests"
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(sqlEnum(TimeOffStatusEnum), default=TimeOffStatusEnum.PENDING, nullable=False)
        
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "reason": self.reason,
            "status": self.status.value,
            "user": {
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "department": self.user.department.value,
            }
        }