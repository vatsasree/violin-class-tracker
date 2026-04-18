from enum import Enum
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class UserRole(str, Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    PARENT = "parent"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default=UserRole.TEACHER.value)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    level = Column(String)  # Beginner, Intermediate, Advanced
    join_date = Column(DateTime(timezone=True), server_default=func.now())
    contact_email = Column(String)
    parent_name = Column(String)
    timezone = Column(String, default="UTC") # Important for international students

    lessons = relationship("Lesson", back_populates="student", cascade="all, delete-orphan")
    attendance_records = relationship("Attendance", back_populates="student", cascade="all, delete-orphan")
    fees = relationship("Fee", back_populates="student", cascade="all, delete-orphan")
    practices = relationship("PracticeSession", back_populates="student", cascade="all, delete-orphan")
    repertoire = relationship("Repertoire", back_populates="student", cascade="all, delete-orphan")

class DayOfWeek(str, Enum):
    MONDAY = "Monday"
    TUESDAY = "Tuesday"
    WEDNESDAY = "Wednesday"
    THURSDAY = "Thursday"
    FRIDAY = "Friday"
    SATURDAY = "Saturday"
    SUNDAY = "Sunday"

class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    start_time = Column(Time, nullable=False)  # Local time in student's timezone
    duration_minutes = Column(Integer, default=60)
    day_of_week = Column(String, nullable=False)
    status = Column(String, default="Active")

    student = relationship("Student", back_populates="lessons")

class Attendance(Base):
    __tablename__ = "attendance"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    class_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String) # Present, Absent, Excused
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="attendance_records")

class Fee(Base):
    __tablename__ = "fees"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    amount = Column(Float, nullable=False)
    due_date = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="Pending") # Paid, Pending

    student = relationship("Student", back_populates="fees")

class PracticeSession(Base):
    __tablename__ = "practice_sessions"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    date = Column(DateTime(timezone=True), nullable=False)
    duration_minutes = Column(Integer, nullable=False)
    notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="practices")

class Repertoire(Base):
    __tablename__ = "repertoire"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"))
    piece_name = Column(String, nullable=False)
    composer = Column(String, nullable=True)
    status = Column(String, default="Learning") # Learning, Mastered

    student = relationship("Student", back_populates="repertoire")
