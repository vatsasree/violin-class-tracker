from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.domain import Student
from app.schemas.student import StudentCreate, StudentUpdate

async def get_students(db: AsyncSession, skip: int = 0, limit: int = 100):
    result = await db.execute(select(Student).offset(skip).limit(limit))
    return result.scalars().all()

async def create_student(db: AsyncSession, student_in: StudentCreate):
    db_student = Student(**student_in.dict())
    db.add(db_student)
    await db.commit()
    await db.refresh(db_student)
    return db_student

async def get_student(db: AsyncSession, student_id: int):
    result = await db.execute(select(Student).filter(Student.id == student_id))
    return result.scalar_one_or_none()

async def update_student(db: AsyncSession, student_id: int, student_in: StudentUpdate):
    db_student = await get_student(db, student_id)
    if not db_student:
        return None
    
    update_data = student_in.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_student, key, value)
    
    await db.commit()
    await db.refresh(db_student)
    return db_student

async def delete_student(db: AsyncSession, student_id: int):
    db_student = await get_student(db, student_id)
    if not db_student:
        return None
    
    await db.delete(db_student)
    await db.commit()
    return db_student
