from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.domain import Attendance
from app.schemas.attendance import AttendanceCreate, AttendanceUpdate

async def get_attendances(db: AsyncSession, student_id: int = None, skip: int = 0, limit: int = 100):
    query = select(Attendance)
    if student_id:
        query = query.filter(Attendance.student_id == student_id)
    query = query.order_by(Attendance.class_date.desc()).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def create_attendance(db: AsyncSession, attendance_in: AttendanceCreate):
    db_attendance = Attendance(**attendance_in.dict())
    db.add(db_attendance)
    await db.commit()
    await db.refresh(db_attendance)
    return db_attendance

async def update_attendance(db: AsyncSession, attendance_id: int, attendance_in: AttendanceUpdate):
    query = select(Attendance).filter(Attendance.id == attendance_id)
    result = await db.execute(query)
    db_attendance = result.scalar_one_or_none()
    
    if db_attendance:
        update_data = attendance_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_attendance, field, value)
        await db.commit()
        await db.refresh(db_attendance)
    return db_attendance
