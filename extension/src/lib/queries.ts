export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;

export const REGISTER_MUTATION = `
  mutation Register($input: UserInput!) {
    register(input: $input) {
      token
      user {
        id
        email
        username
      }
    }
  }
`;