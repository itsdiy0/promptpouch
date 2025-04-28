import {
  Environment,
  Network,
  RecordSource,
  Store,
  FetchFunction,
  RequestParameters
} from 'relay-runtime';

const fetchGraphQL: FetchFunction = async (params: RequestParameters, variables: Record<string, any>) => {
  // URL to your GraphQL API
  const apiUrl = 'http://localhost:8000/graphql';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: params.text,
      variables,
    }),
  });

  return response.json();
};

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource());

export const environment = new Environment({
  network,
  store,
});