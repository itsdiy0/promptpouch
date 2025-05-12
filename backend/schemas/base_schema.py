import strawberry
from typing import Optional
from jose import jwt, JWTError  # Import JWTError from jose
from oauth2 import SECRET_KEY, ALGORITHM

@strawberry.type
class AuthInfo:
    user_id: Optional[int] = None

async def get_current_user(info) -> AuthInfo:
    context = info.context
    request = context.get("request")
    auth_info = AuthInfo()
    
    if not request:
        print("No request in context")
        return auth_info
        
    authorization = request.headers.get("Authorization")
    if not authorization:
        print("No Authorization header found")
        return auth_info
        
    if not authorization.startswith("Bearer "):
        print("Authorization header does not start with Bearer")
        return auth_info
        
    token = authorization.replace("Bearer ", "")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("user_id")
        if user_id:
            auth_info.user_id = user_id
            print(f"Successfully extracted user_id: {user_id}")
        else:
            print("No user_id found in token payload")
    except JWTError as e:  # Use JWTError from jose, not PyJWTError
        print(f"JWT error: {str(e)}")
        
    return auth_info