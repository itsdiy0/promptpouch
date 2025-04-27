from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter
from db import init_db, get_db
from schema import schema

app = FastAPI()

async def get_context():
    # Call get_db() and use async for to retrieve the session
    async for db in get_db():
        return {"db": db}

# Add the GraphQL router
graphql_app = GraphQLRouter(schema, context_getter=get_context)
app.include_router(graphql_app, prefix="/graphql")

@app.on_event("startup")
async def on_startup():
    # Initialize the database asynchronously
    await init_db()

