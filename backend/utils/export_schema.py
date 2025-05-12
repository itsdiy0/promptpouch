import sys
from pathlib import Path

# Add the parent directory to sys.path
sys.path.append(str(Path(__file__).parent.parent))

# Now import the schema
from schemas import schema

output_dir = Path(__file__).parent.parent / "schemas/generated"
output_dir.mkdir(exist_ok=True)

# Export the schema to a .graphql file
schema_file = output_dir / "schema.graphql"
schema_file.write_text(schema.as_str())
print(f"GraphQL schema exported to {schema_file.resolve()}")