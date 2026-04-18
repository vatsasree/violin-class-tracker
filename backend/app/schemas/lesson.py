from datetime import time
from typing import Optional
from pydantic import BaseModel

class LessonBase(BaseModel):
    student_id: int
    start_time: time
    duration_minutes: int = 60
    day_of_week: str  # Monday, Tuesday, etc.
    status: str = "Active"

class LessonCreate(LessonBase):
    pass

class LessonUpdate(LessonBase):
    student_id: Optional[int] = None
    start_time: Optional[time] = None
    day_of_week: Optional[str] = None

class LessonRead(LessonBase):
    id: int

    class Config:
        from_attributes = True
