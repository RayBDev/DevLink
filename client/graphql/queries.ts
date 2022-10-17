import { gql } from '@apollo/client';

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
