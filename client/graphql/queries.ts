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
