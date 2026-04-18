from fastapi import APIRouter
from app.api.v1.endpoints import students, lessons, auth, attendance

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
api_router.include_router(lessons.router, prefix="/lessons", tags=["lessons"])
api_router.include_router(attendance.router, prefix="/attendance", tags=["attendance"])
