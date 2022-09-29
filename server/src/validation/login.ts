import Validator from 'validator';
import { LoginArgs } from '../resolvers/user';
import { isEmpty } from './is-empty';

type Errors =
  | {
      email?: string;
      password?: string;
    }
  | undefined;

export const validateLoginInput = (data: LoginArgs) => {
  let { email, password } = data.input;
  let errors: Errors = {};

  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
