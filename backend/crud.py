from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models

async def create_prompt(db: AsyncSession, title: str, content: str):
    prompt = models.Prompt(title=title, content=content)
    db.add(prompt)
    await db.commit()  # Asynchronously commit the transaction
    await db.refresh(prompt)
    return prompt

async def get_prompts(db: AsyncSession, skip: int = 0, limit: int = 10):
    result = await db.execute(select(models.Prompt).offset(skip).limit(limit))
    return result.scalars().all()

async def get_prompt_by_id(db: AsyncSession, prompt_id: int):
    result = await db.execute(select(models.Prompt).filter(models.Prompt.id == prompt_id))
    return result.scalar_one_or_none()
