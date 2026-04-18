from datetime import datetime
from typing import Optional
from pydantic import BaseModel

class AttendanceBase(BaseModel):
    student_id: int
    class_date: datetime
    status: str = "Present" # Present, Absent, Excused
    notes: Optional[str] = None

class AttendanceCreate(AttendanceBase):
    pass

class AttendanceUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

class AttendanceRead(AttendanceBase):
    id: int

    class Config:
        from_attributes = True
