import strawberry
from typing import Optional
import crud
from passlib.context import CryptContext
from oauth2 import create_access_token
from .base_schema import get_current_user, AuthInfo

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# User types
@strawberry.type
class User:
    id: int
    email: str
    username: str

@strawberry.type
class AuthPayload:
    token: str
    user: User

@strawberry.input
class UserInput:
    email: str
    username: str
    password: str

@strawberry.input
class LoginInput:
    email: str
    password: str

# Auth mutations
@strawberry.type
class AuthMutations:
    @strawberry.mutation
    async def register(
        self, 
        info, 
        input: UserInput
    ) -> AuthPayload:
        db = info.context["db"]
        
        # Check if user already exists
        existing_user = await crud.get_user_by_email(db, input.email)
        if existing_user:
            raise Exception("User with this email already exists")
            
        # Hash the password
        hashed_password = pwd_context.hash(input.password)
        
        # Create user
        user = await crud.create_user(
            db, 
            email=input.email, 
            username=input.username, 
            password=hashed_password
        )
        
        # Create JWT token
        token = create_access_token(data={"user_id": user.id})
        
        return AuthPayload(
            token=token,
            user=User(id=user.id, email=user.email, username=user.username)
        )
    
    @strawberry.mutation
    async def login(
        self, 
        info, 
        email: str, 
        password: str
    ) -> AuthPayload:
        db = info.context["db"]
        
        # Get user by email
        user = await crud.get_user_by_email(db, email)
        if not user:
            raise Exception("Invalid credentials")
            
        # Verify password
        if not pwd_context.verify(password, user.password):
            raise Exception("Invalid credentials")
            
        # Create JWT token
        token = create_access_token(data={"user_id": user.id})
        
        return AuthPayload(
            token=token,
            user=User(id=user.id, email=user.email, username=user.username)
        )