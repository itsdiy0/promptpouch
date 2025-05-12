from jose import JWTError, jwt
from datetime import datetime, timedelta
from fastapi import status, HTTPException
from config import settings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models

# SECRET_KEY, ALGORITHM, and ACCESS_TOKEN_EXPIRE_MINUTES remain the same
SECRET_KEY = settings.secret_key
ALGORITHM = settings.algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = settings.access_token_expire_minutes

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    jwt_token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return jwt_token

async def verify_token(token: str):
    credential_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        
        if user_id is None:
            raise credential_exception
            
        return user_id
    except JWTError:
        raise credential_exception

async def get_current_user(db: AsyncSession, token: str):
    user_id = await verify_token(token)
    
    # Query the user from the database
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    user = result.scalars().first()
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user