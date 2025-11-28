from app.extensions import db
from flask_login import UserMixin
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Text, DateTime, Date, Time, func, desc
from sqlalchemy.orm import relationship
from datetime import datetime, time
from enum import  Enum


class DepartmentEnum(Enum):
    SALES = "sales"
    SERVICE = "service"
    CLEANER = "cleaner"
    TECHNICIAN = "technician"
    
class TimeOffStatusEnum(Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DENIED = "denied"
    
class LocationEnum(Enum):
    LAKE_CHARLES = "lake_charles"
    JENNINGS = "jennings"
    LAFAYETTE = "lafayette"

class User(db.Model, UserMixin):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(256), nullable=False, unique=True)
    password_hash = Column(String(256), nullable=False)
    
    
class Employee(db.Model):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True)
    first_name = Column(String(150), nullable=False)
    last_name = Column(String(150), nullable=False)
    email = Column(String(256), nullable=False, unique=True)
    department = Column(Enum(DepartmentEnum))
    
    schedules = relationship("Schedule", backref="employee", lazy=True)
    availablity = relationship("Availablity", backref="employee", lazy=True)
    time_off_requests = relationship("TimeOffRequest", backref="employee", lazy=True)
    

class Shift(db.Model):
    __tablename__ = "shifts"
    
    id = Column(Integer, primary_key=True)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    
    schedules = relationship("Schedule", backref="shift", lazy=True)
    
    
class Schedule(db.Model):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    shift_id = Column(Integer, ForeignKey("Shift.id"), nullable=False)
    shift_date = Column(Date, nullable=False)
    location = Column(Enum(LocationEnum))
    
    
class Availablity(db.Model):
    __tablename__ = "availablity"
    
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("User.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    

class TimeOffRequest(db.Model):
    __tablename__ = "time_off_requests"
    
    id = Column(Integer, primary_key=True)
    employee_id = Column(Integer, ForeignKey("User.id"))
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    reason = Column(String(255))
    status = Column(Enum(TimeOffStatusEnum), default=TimeOffStatusEnum.PENDING)