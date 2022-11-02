import { gql } from '@apollo/client';

export const REGISTER = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      _id
      name
      email
      avatar
    }
  }
`;
export const CREATE_POST = gql`
  mutation CreatePost($input: PostInput!) {
    createPost(input: $input) {
      user
      text
      name
      avatar
      likes {
        user
      }
      comments {
        user
        text
        name
        avatar
      }
      createdAt
      updatedAt
    }
  }
`;
