import { graphql,useLazyLoadQuery } from 'react-relay';


export const PromptsListQuery = graphql`
  query PromptsListQuery {
    prompts {
      id
      title
      content
    }
  }
`;

function PromptsList() {
  const data:any = useLazyLoadQuery(PromptsListQuery, {});
  console.log(data);
  return (
    <div>
      <p>This is a placeholder. We'll implement the actual data fetching later.</p>
    </div>
  );
}

export default PromptsList;