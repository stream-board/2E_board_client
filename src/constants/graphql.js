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

export const ALL_ROOMS_QUERY = gql`
  query AllRoomsQuery{
    allRooms{
      idRoom,
      nameRoom,
      descriptionRoom,
      categoryRoom,
      owner{
        id,
        name,
        nickname,
        image
      }
    }
  }
`

export const ROOM_BY_ID_QUERY = gql`
  query RoomByIdQuery($id: Int!){
    roomById(id: $id){
      nameRoom,
      descriptionRoom,
      idRoom,
      categoryRoom,
      owner{
        id
      }
      Participants{
        id,
        name,
        nickname,
        image
      }
    }
  }
`

export const MESSAGES_BY_ROOM_ID_QUERY = gql`
  query MessagesByRoomIdQuery($id: Int!){
    chatMsgByRoomId(id: $id){
      user_id,
      message
    }
  }
`

export const USER_IMAGE_BY_ID_QUERY = gql`
  query UserImageByIdQuery($id: Int!){
    userById(id: $id){
      data{
        image
      }
    }
  }
`

export const PARTICIPANTS_BY_ID_QUERY = gql`
  query ParticipantsById($id: Int!){
    participantsById(id: $id){
      id,
      name,
      nickname,
      image
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

export const CREATE_ROOM_MUTATION = gql`
mutation CreateRoomMutation($idOwner: Int!, $nameRoom: String!, $descriptionRoom: String!, $categoryRoom: String!) {
  createRoom(
    room:{
      idOwner: $idOwner,
      nameRoom: $nameRoom,
      descriptionRoom: $descriptionRoom,
      categoryRoom: $categoryRoom
    }
  ) {
    idRoom
  }
}
`

export const JOIN_ROOM_MUTATION = gql`
mutation JoinRoomMutation($idOwner: Int!, $idRoom: Int!) {
  joinRoom(
    room:{
      idOwner: $idOwner,
      idRoom: $idRoom
    }
  ) {
    idRoom
  }
}
`

export const DELETE_ROOM_MUTATION = gql`
mutation DeleteRoomMutation($idOwner: Int!, $idRoom: Int!) {
  deleteRoom(
    roomDelete:{
      idOwner: $idOwner,
      idRoom: $idRoom
    }
  ) {
    idRoom
  }
}
`

export const EXIT_ROOM_MUTATION = gql`
mutation ExitRoomMutation($idOwner: Int!, $idRoom: Int!) {
  exitRoom(
    roomDelete:{
      idOwner: $idOwner,
      idRoom: $idRoom
    }
  ) {
    idRoom
  }
}
`

export const DELETE_SESSION_MUTATION = gql`
mutation DeleteSessionMutation($uid: String!, $token: String!, $client: String!) {
  deleteSession(headersSession: {
    uid: $uid,
    token: $token,
    client: $client
  }){
    success
  }
}
`

// Subscriptions

export const ROOM_ADDED_SUBSCRIPTION = gql`
subscription RoomAdded{
  roomAdded{
    idRoom,
    nameRoom,
    owner{
      id,
      name,
      nickname,
      image
    },
    descriptionRoom,
    categoryRoom
  }
}`

export const ROOM_DELETED_SUBSCRIPTION = gql`
subscription RoomDeleted{
  roomDeleted{
    idRoom
  }
}`

export const PARTICIPANT_JOINED_SUBSCRIPTION = gql`
subscription ParticipantJoined($roomId: Int!){
  participantJoined(roomId: $roomId){
    id,
    name,
    nickname,
    image
  }
}`

export const PARTICIPANT_LEFT_SUBSCRIPTION = gql`
subscription ParticipantLeft($roomId: Int!){
  participantLeft(roomId: $roomId)
}`
