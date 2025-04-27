from sqlalchemy.ext.asyncio import AsyncEngine, AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set.")

# Create an async engine
engine: AsyncEngine = create_async_engine(DATABASE_URL, echo=True)

# Create a sessionmaker for async sessions
SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# Base class for models
Base = declarative_base()

# Function to initialize the database and create tables asynchronously
async def init_db() -> None:
    try:
        async with engine.begin() as conn:
            # Use run_sync to execute synchronous ORM methods
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Error during database initialization: {e}")
        raise

# Dependency to get the database session
async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()