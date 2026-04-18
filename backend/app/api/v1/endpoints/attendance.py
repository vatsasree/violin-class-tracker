from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.attendance import AttendanceCreate, AttendanceRead, AttendanceUpdate
from app.services import attendance_service

router = APIRouter()

@router.get("/", response_model=List[AttendanceRead])
async def read_attendances(
    student_id: Optional[int] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: AsyncSession = Depends(get_db)
):
    return await attendance_service.get_attendances(db, student_id=student_id, skip=skip, limit=limit)

@router.post("/", response_model=AttendanceRead)
async def create_attendance(attendance_in: AttendanceCreate, db: AsyncSession = Depends(get_db)):
    return await attendance_service.create_attendance(db, attendance_in=attendance_in)

@router.patch("/{attendance_id}", response_model=AttendanceRead)
async def update_attendance(
    attendance_id: int, 
    attendance_in: AttendanceUpdate, 
    db: AsyncSession = Depends(get_db)
):
    db_attendance = await attendance_service.update_attendance(db, attendance_id=attendance_id, attendance_in=attendance_in)
    if not db_attendance:
        raise HTTPException(status_code=404, detail="Session not found")
    return db_attendance
