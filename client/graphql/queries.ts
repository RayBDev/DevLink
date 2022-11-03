import { gql } from '@apollo/client';

export const LOGIN = gql`
  query Login($input: LoginInput!) {
    login(input: $input) {
      _id
      name
      email
      avatar
    }
  }
`;

export const GET_CURRENT_USER = gql`
  query Current {
    current {
      _id
      name
      email
      avatar
    }
  }
`;

export const FORGET_PW = gql`
  query Forgetpw($input: ForgetPWInput!) {
    forgetpw(input: $input) {
      result
    }
  }
`;

export const GET_HANDLE = gql`
  query Profile {
    profile {
      handle
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query AllPosts {
    allPosts {
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

export const GET_POST_BY_ID = gql`
  query PostById($input: PostIdInput!) {
    postById(input: $input) {
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

export const GET_POSTS_BY_USER = gql`
  query PostsByUser($input: UserIdInput!) {
    postsByUser(input: $input) {
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
