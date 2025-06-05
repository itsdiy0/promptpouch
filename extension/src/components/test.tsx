// src/App.jsx
import { useQuery } from '@urql/preact';
import type {Prompt} from '../types';
// Example GraphQL query
const GET_DATA = `
query {
  getPrompts {
    id,
    title,
    content
  }
  }

`;

function Test() {
  const [result] = useQuery({
    query: GET_DATA,
  });

  const { data, fetching, error } = result;

  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>My Preact + urql App</h1>
      <ul>
        {data?.getPrompts.map((prompt:Prompt)=> (
          <li key={prompt.id}>{prompt.title}</li>
        ))}
      </ul>
    </div>
  );
}

export default Test;