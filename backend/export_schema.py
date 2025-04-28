from schema import schema  # Import your Strawberry schema
from pathlib import Path

# Export the schema to a .graphql file
schema_file = Path("schema.graphql")
schema_file.write_text(schema.as_str())
print(f"GraphQL schema exported to {schema_file.resolve()}")