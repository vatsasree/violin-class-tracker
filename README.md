# 🎻 ViolinPro - Class Management Platform

A production-grade, full-stack application designed for private violin teachers to manage international students, schedules, and repertoire.

## 🚀 Engineering Highlights
- **Full-Stack Architecture**: FastAPI (Asynchronous Python) backend with a React (TypeScript) frontend.
- **Timezone-Aware Scheduling**: Handles international students with side-by-side local time visualization.
- **Modern Tech Stack**: PostgreSQL, SQLAlchemy, Tailwind CSS, and Vite.
- **Industrial Grade Workflows**:
  - **Dockerized**: Containerized services with multi-stage production builds.
  - **CI/CD**: GitHub Actions pipeline for automated linting and build verification.
  - **Observability**: Integrated Sentry error tracking.

## 🛠 Tech Stack
| Tier | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons |
| **Backend** | FastAPI, Pydantic, SQLAlchemy 2.0 (Async) |
| **Database** | PostgreSQL |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Monitoring** | Sentry SDK |

## 📦 Getting Started

### Local Development (with Docker)
Ensure you have Docker and Docker Compose installed, then run:
```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- API Documentation: `http://localhost:8000/docs` (Swagger UI)

### Local Development (without Docker)
1. **Backend**:
   - Create a conda/venv and install `requirements.txt`.
   - Run `uvicorn app.main:app --reload`.
2. **Frontend**:
   - `npm install`
   - `npm run dev`

## 📋 Features
- **Teacher Dashboard**: Real-time stats on lessons and student activity.
- **Student Management**: Full profile tracking for repertoire, levels, and contact info.
- **Weekly Schedule**: Visual grid showing a teacher's recurring weekly commitment.
- **Dummy Auth**: Ready-to-use authentication bridge for future security scaling.

---
*Created as a demonstration of production-level software engineering maturity.*
