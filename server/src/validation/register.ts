import Validator from 'validator';
import { RegisterArgs } from '../resolvers/user';
import { isEmpty } from './is-empty';

type Errors =
  | {
      name?: string;
      email?: string;
      password?: string;
      password2?: string;
    }
  | undefined;

export const validateRegisterInput = (data: RegisterArgs) => {
  let { name, email, password, password2 } = data.input;
  let errors: Errors = {};

  name = !isEmpty(name) ? name : '';
  email = !isEmpty(email) ? email : '';
  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

  if (!Validator.isLength(name, { min: 2, max: 30 })) {
    errors.name = 'Name must be between 2 and 30 characters';
  }

  if (Validator.isEmpty(name)) {
    errors.name = 'Name field is required';
  }

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  if (!Validator.isLength(password, { min: 6, max: 32 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.equals(password, password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
