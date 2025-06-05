// src/client.js
import { createClient, cacheExchange, fetchExchange} from '@urql/preact';

const client = createClient({
  url: 'http:localhost:8000/graphql',
  exchanges: [cacheExchange, fetchExchange],
});

export default client;