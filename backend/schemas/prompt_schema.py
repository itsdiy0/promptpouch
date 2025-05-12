import strawberry
from typing import List, Optional
import crud
from .base_schema import get_current_user, AuthInfo

@strawberry.type
class Prompt:
    id: int
    title: str
    content: str
    owner_id: Optional[int] = None

@strawberry.input
class PromptInput:
    title: str
    content: str

@strawberry.type
class PromptQueries:
    @strawberry.field
    async def get_prompts(self, info) -> List[Prompt]:
        db = info.context["db"]
        prompts = await crud.get_prompts(db)
        return [Prompt(id=p.id, title=p.title, content=p.content, owner_id=p.owner_id) for p in prompts]
    
    @strawberry.field
    async def get_prompt(self, info, id: int) -> Optional[Prompt]:
        db = info.context["db"]
        prompt = await crud.get_prompt(db, id)
        if prompt:
            return Prompt(id=prompt.id, title=prompt.title, content=prompt.content, owner_id=prompt.owner_id)
        return None

@strawberry.type
class PromptMutations:
    @strawberry.mutation
    async def create_prompt(self, info, input: PromptInput) -> Prompt:
        db = info.context["db"]
        auth_info = await get_current_user(info)
        
        # Check if user is authenticated
        if not auth_info.user_id:
            raise Exception("Authentication required")
        
        print(auth_info.user_id)
        prompt = await crud.create_prompt(
            db, 
            title=input.title, 
            content=input.content,
            owner_id=auth_info.user_id
        )
        
        return Prompt(
            id=prompt.id, 
            title=prompt.title, 
            content=prompt.content,
            owner_id=prompt.owner_id
        )
    
    @strawberry.mutation
    async def update_prompt(self, info, id: int, input: PromptInput) -> Prompt:
        db = info.context["db"]
        auth_info = await get_current_user(info)
        
        # Check if user is authenticated
        if not auth_info.user_id:
            raise Exception("Authentication required")
        
        # Check if prompt exists and is owned by the user
        existing_prompt = await crud.get_prompt(db, id)
        if not existing_prompt:
            raise Exception("Prompt not found")
        
        if existing_prompt.owner_id != auth_info.user_id:
            raise Exception("Not authorized to update this prompt")
        
        prompt = await crud.update_prompt(
            db, 
            prompt_id=id,
            title=input.title,
            content=input.content
        )
        
        return Prompt(
            id=prompt.id, 
            title=prompt.title, 
            content=prompt.content,
            owner_id=prompt.owner_id
        )
    
    @strawberry.mutation
    async def delete_prompt(self, info, id: int) -> bool:
        db = info.context["db"]
        auth_info = await get_current_user(info)
        
        # Check if user is authenticated
        if not auth_info.user_id:
            raise Exception("Authentication required")
        
        # Check if prompt exists and is owned by the user
        existing_prompt = await crud.get_prompt(db, id)
        if not existing_prompt:
            raise Exception("Prompt not found")
        
        if existing_prompt.owner_id != auth_info.user_id:
            raise Exception("Not authorized to delete this prompt")
        
        success = await crud.delete_prompt(db, id)
        return success

schema = strawberry.Schema(query=PromptQueries, mutation=PromptMutations)