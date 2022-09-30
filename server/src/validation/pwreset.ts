import Validator from 'validator';
import { ForgetPWArgs, ResetPWArgs } from '../resolvers/user';
import { isEmpty } from './is-empty';

type EmailErrors =
  | {
      email?: string;
    }
  | undefined;

type PasswordErrors =
  | {
      password?: string;
      password2?: string;
    }
  | undefined;

export const validateEmailInput = (data: ForgetPWArgs) => {
  let { email } = data.input;
  let errors: EmailErrors = {};

  email = !isEmpty(email) ? email : '';

  if (!Validator.isEmail(email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(email)) {
    errors.email = 'Email field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validatePasswordInput = (data: ResetPWArgs) => {
  let { password, password2 } = data.input;
  let errors: PasswordErrors = {};

  password = !isEmpty(password) ? password : '';
  password2 = !isEmpty(password2) ? password2 : '';

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
