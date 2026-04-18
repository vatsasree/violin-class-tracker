from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Violin Class Management API"
    DATABASE_URL: str = "postgresql+asyncpg://user:password@localhost:5432/violin_db"

    class Config:
        env_file = ".env"

settings = Settings()
