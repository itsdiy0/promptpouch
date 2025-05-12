import { useState } from 'react';
import { graphql, useMutation } from 'react-relay';

const createPromptMutation = graphql`
  mutation CreatePromptMutation($input: PromptInput!) {
    createPrompt(input: $input) {
      id
      title
      content
    }
  }
`;

function CreatePrompt() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [commit, isInFlight] = useMutation(createPromptMutation);
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    commit({
      variables: {
        input: { title, content }
      },
      onCompleted: (data, errors) => {
        if (!errors) {
          setTitle('');
          setContent('');
          alert('Prompt created successfully!');
        }
      },
      onError: (error) => {
        console.error('Error creating prompt:', error);
        alert('Failed to create prompt. Please try again.');
      }
    });
  };
  
  return (
    <div>
      <h2>Create New Prompt</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={5}
          />
        </div>
        <button type="submit" disabled={isInFlight}>
          {isInFlight ? 'Creating...' : 'Create Prompt'}
        </button>
      </form>
    </div>
  );
}

export default CreatePrompt;