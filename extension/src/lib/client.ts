import { createClient, fetchExchange } from 'urql';
import { authExchange } from '@urql/exchange-auth';
import { authStorage } from '../utils/auth-storage';

const client = createClient({
  url: 'http://localhost:8000/graphql', // Replace with your actual endpoint
  exchanges: [
    authExchange(async (utils) => {
      let token = await authStorage.getToken();

      return {
        addAuthToOperation(operation) {
          if (!token) return operation;
          
          return utils.appendHeaders(operation, {
            Authorization: `Bearer ${token}`,
          });
        },
        willAuthError() {
          return !token;
        },
        didAuthError(error) {
          return error.graphQLErrors.some(
            (e) => e.extensions?.code === 'FORBIDDEN' || e.extensions?.code === 'UNAUTHORIZED'
          );
        },
        async refreshAuth() {
          // Handle token refresh logic here if needed
          await authStorage.clearAuth();
          token = null;
        },
      };
    }),
    fetchExchange,
  ],
});

export default client;