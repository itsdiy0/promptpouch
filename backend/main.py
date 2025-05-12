from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from strawberry.fastapi import GraphQLRouter
from db import init_db, get_db
from schemas import schema

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

async def get_context(request: Request):
    # Call get_db() and use async for to retrieve the session
    async for db in get_db():
        return {"db": db, "request": request}

# Add the GraphQL router
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

@app.on_event("startup")
async def on_startup():
    # Initialize the database asynchronously
    await init_db()

