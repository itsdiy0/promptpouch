import { graphql } from 'react-relay';


export const PromptListQuery = graphql`
  query PromptsListQuery {
    getPrompts {
      id
      title
    }
  }
`;

function PromptsList() {
  return (
    <div>
      <p>This is a placeholder. We'll implement the actual data fetching later.</p>
    </div>
  );
}

export default PromptsList;