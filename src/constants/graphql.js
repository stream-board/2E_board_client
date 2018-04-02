import gql from 'graphql-tag'

export const CREATE_SESSION_MUTATION = gql`
  mutation CreateSessionMutation($email: String!, $password: String!) {
    createSession(
      session:{
        email: $email,
        password: $password,
      }
    ) {
      id
      uid
      nickname
      image
      token
    }
  }
`
