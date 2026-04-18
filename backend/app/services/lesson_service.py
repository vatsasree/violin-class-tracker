from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.models.domain import Lesson, Student
from app.schemas.lesson import LessonCreate

async def get_lessons(db: AsyncSession, skip: int = 0, limit: int = 100, student_id: int = None):
    query = select(Lesson)
    if student_id:
        query = query.filter(Lesson.student_id == student_id)
    result = await db.execute(query.offset(skip).limit(limit))
    return result.scalars().all()

async def create_lesson(db: AsyncSession, lesson_in: LessonCreate):
    db_lesson = Lesson(**lesson_in.dict())
    db.add(db_lesson)
    await db.commit()
    await db.refresh(db_lesson)
    return db_lesson
