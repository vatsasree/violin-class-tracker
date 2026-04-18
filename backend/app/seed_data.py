import asyncio
import random
from datetime import time, datetime, timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal
from app.models.domain import Student, Lesson, User, UserRole

async def seed_data():
    async with AsyncSessionLocal() as session:
        # 1. Create a dummy teacher/admin user if none exists
        from sqlalchemy.future import select
        res = await session.execute(select(User).filter(User.email == "admin@example.com"))
        if not res.scalar_one_or_none():
            admin = User(
                email="admin@example.com",
                hashed_password="password", 
                role=UserRole.ADMIN.value
            )
            session.add(admin)

        # 2. Add some students in different timezones
        students_data = [
            {"name": "Alice Smith", "level": "Beginner", "timezone": "Europe/London"},
            {"name": "Bob Chen", "level": "Intermediate", "timezone": "Asia/Singapore"},
            {"name": "Charlie Davis", "level": "Advanced", "timezone": "America/New_York"},
            {"name": "Sreevatsa", "level": "Intermediate", "timezone": "Asia/Kolkata"},
        ]

        students = []
        for data in students_data:
            s = Student(**data, contact_email=f"{data['name'].lower().replace(' ', '.')}@example.com")
            session.add(s)
            students.append(s)

        await session.flush() # To get IDs

        # 3. Add some lessons for these students
        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
        for student in students:
            # Add 2 lessons per week for each
            for _ in range(2):
                lesson = Lesson(
                    student_id=student.id,
                    start_time=time(hour=random.randint(9, 17), minute=0),
                    day_of_week=random.choice(days),
                    duration_minutes=60,
                    status="Active"
                )
                session.add(lesson)

        await session.commit()
        print("Database seeded successfully!")

if __name__ == "__main__":
    asyncio.run(seed_data())
