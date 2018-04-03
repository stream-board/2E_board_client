import gql from 'graphql-tag'

// Queries

export const VALIDATE_TOKEN_QUERY = gql`
  query ValidateTokenQuery($uid: String!, $client: String!, $token: String!){
    validateSession(headersSession:{
      uid: $uid,
      client: $client,
      token: $token
    }) {
      id,
      name,
      nickname,
      image,
      token,
      client,
      type
    }
  }
`

// Mutations

export const CREATE_SESSION_MUTATION = gql`
  mutation CreateSessionMutation($email: String!, $password: String!) {
    createSession(
      session:{
        email: $email,
        password: $password,
      }
    ) {
      id
      name
      email
      nickname
      image
      token
      client
    }
  }
`

export const CREATE_BOARD_ROOM_MUTATION = gql`
mutation CreateBoardRoomMutation($id: Int!, $admin: String!) {
  createBoardRoom(
    room:{
      id: $id,
      admin: $admin,
    }
  ) {
    id
  }
}
`
