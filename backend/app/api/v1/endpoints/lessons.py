from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.lesson import LessonCreate, LessonRead
from app.services import lesson_service

router = APIRouter()

@router.get("/", response_model=List[LessonRead])
async def read_lessons(
    skip: int = 0, 
    limit: int = 100, 
    student_id: Optional[int] = None,
    db: AsyncSession = Depends(get_db)
):
    return await lesson_service.get_lessons(db, skip=skip, limit=limit, student_id=student_id)

@router.post("/", response_model=LessonRead, status_code=status.HTTP_201_CREATED)
async def create_lesson(lesson_in: LessonCreate, db: AsyncSession = Depends(get_db)):
    return await lesson_service.create_lesson(db, lesson_in=lesson_in)
