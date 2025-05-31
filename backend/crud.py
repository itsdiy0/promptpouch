from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update, delete
import models
from typing import Optional, List

async def create_prompt(db: AsyncSession, title: str, content: str,owner_id:int):
    prompt = models.Prompt(title=title, content=content,owner_id=owner_id)
    db.add(prompt)
    await db.commit()  # Asynchronously commit the transaction
    await db.refresh(prompt)
    return prompt

async def get_prompts(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Prompt).offset(skip).limit(limit))
    return result.scalars().all()

async def get_prompts_by_owner(db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 10):
    result = await db.execute(
        select(models.Prompt)
        .filter(models.Prompt.owner_id == owner_id)
        .offset(skip)
        .limit(limit)
    )
    return result.scalars().all()

async def get_prompt_by_id(db: AsyncSession, prompt_id: int):
    result = await db.execute(select(models.Prompt).filter(models.Prompt.id == prompt_id))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, email: str, username: str, password: str):
    user = models.User(email=email, username=username, password=password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def get_user(db: AsyncSession, user_id: int):
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str):
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalar_one_or_none()

async def update_user(db: AsyncSession, user_id: int, **kwargs):
    stmt = update(models.User).where(models.User.id == user_id).values(**kwargs)
    await db.execute(stmt)
    await db.commit()
    return await get_user(db, user_id)

async def delete_user(db: AsyncSession, user_id: int):
    stmt = delete(models.User).where(models.User.id == user_id)
    await db.execute(stmt)
    await db.commit()
    return True
