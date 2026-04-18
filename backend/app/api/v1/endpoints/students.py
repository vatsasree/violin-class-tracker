from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.student import StudentCreate, StudentRead, StudentUpdate
from app.services import student_service

router = APIRouter()

@router.get("/", response_model=List[StudentRead])
async def read_students(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    return await student_service.get_students(db, skip=skip, limit=limit)

@router.post("/", response_model=StudentRead, status_code=status.HTTP_201_CREATED)
async def create_student(student_in: StudentCreate, db: AsyncSession = Depends(get_db)):
    return await student_service.create_student(db, student_in=student_in)

@router.get("/{student_id}", response_model=StudentRead)
async def read_student(student_id: int, db: AsyncSession = Depends(get_db)):
    db_student = await student_service.get_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.patch("/{student_id}", response_model=StudentRead)
async def update_student(student_id: int, student_in: StudentUpdate, db: AsyncSession = Depends(get_db)):
    db_student = await student_service.update_student(db, student_id=student_id, student_in=student_in)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@router.delete("/{student_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(student_id: int, db: AsyncSession = Depends(get_db)):
    db_student = await student_service.delete_student(db, student_id=student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return None
