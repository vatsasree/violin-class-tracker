from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr

class StudentBase(BaseModel):
    name: str
    level: Optional[str] = "Beginner"
    contact_email: Optional[EmailStr] = None
    parent_name: Optional[str] = None
    timezone: str = "UTC"

class StudentCreate(StudentBase):
    pass

class StudentUpdate(StudentBase):
    name: Optional[str] = None
    timezone: Optional[str] = None

class StudentRead(StudentBase):
    id: int
    join_date: datetime

    class Config:
        from_attributes = True
