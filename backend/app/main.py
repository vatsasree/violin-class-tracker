from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
from app.api.v1.api import api_router

# Initialize Sentry (using a placeholder DSN)
sentry_sdk.init(
    dsn="https://placeholder@sentry.io/12345",
    traces_sample_rate=1.0,
    profiles_sample_rate=1.0,
)

app = FastAPI(title="Violin Class Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend deployment URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Welcome to Violin Class Management API"}
