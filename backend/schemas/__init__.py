import strawberry
from .user_schema import AuthMutations
from .prompt_schema import PromptQueries, PromptMutations

@strawberry.type
class Query(PromptQueries):
    pass

@strawberry.type
class Mutation(AuthMutations, PromptMutations):
    pass

schema = strawberry.Schema(query=Query, mutation=Mutation)