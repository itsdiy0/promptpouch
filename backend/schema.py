import strawberry
from strawberry.types import Info
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select 
from sqlalchemy.exc import SQLAlchemyError
from models import Prompt
from typing import List

@strawberry.type
class PromptType:
    id: int
    title: str
    content: str

@strawberry.input
class PromptInput:
    title: str
    content: str

@strawberry.type
class Query:
    @strawberry.field
    async def get_prompts(self, info: Info) -> List[PromptType]:
        # Fetch all prompts from the database and return them as a list
        db: AsyncSession = info.context["db"]
        try:
            result = await db.execute(select(Prompt))
            prompts = result.scalars().all()
            return [PromptType(id=prompt.id, title=prompt.title, content=prompt.content) for prompt in prompts]
        except SQLAlchemyError as e:
            raise ValueError(f"Failed to fetch prompts: {str(e)}")

    @strawberry.field
    async def get_prompt(self, info: Info, id: int) -> PromptType:
        # Fetch a single prompt by its ID from the database
        db: AsyncSession = info.context["db"]
        try:
            result = await db.execute(select(Prompt).where(Prompt.id == id))
            prompt = result.scalars().first()
            if not prompt:
                raise ValueError(f"Prompt with ID {id} not found")
            return PromptType(id=prompt.id, title=prompt.title, content=prompt.content)
        except SQLAlchemyError as e:
            raise ValueError(f"Failed to fetch prompt with ID {id}: {str(e)}")

@strawberry.type
class Mutation:
    @strawberry.mutation
    async def create_prompt(self, info: Info, input: PromptInput) -> PromptType:
        # Create a new prompt in the database
        db: AsyncSession = info.context["db"]
        new_prompt = Prompt(title=input.title, content=input.content)
        db.add(new_prompt)
        await db.commit()
        await db.refresh(new_prompt)
        return PromptType(id=new_prompt.id, title=new_prompt.title, content=new_prompt.content)

    @strawberry.mutation
    async def update_prompt(self, info: Info, id: int, input: PromptInput) -> PromptType:
        # Update an existing prompt by its ID in the database
        db: AsyncSession = info.context["db"]
        result = await db.execute(select(Prompt).where(Prompt.id == id))
        prompt = result.scalars().first()
        if not prompt:
            raise ValueError("Prompt not found")
        prompt.title = input.title
        prompt.content = input.content
        await db.commit()
        await db.refresh(prompt)
        return PromptType(id=prompt.id, title=prompt.title, content=prompt.content)

    @strawberry.mutation
    async def delete_prompt(self, info: Info, id: int) -> bool:
        # Delete a prompt by its ID from the database
        db: AsyncSession = info.context["db"]
        prompt = await db.get(Prompt, id)
        if not prompt:
            raise ValueError("Prompt not found")
        await db.delete(prompt)
        await db.commit()
        return True

schema = strawberry.Schema(query=Query, mutation=Mutation)