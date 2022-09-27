import Validator from 'validator';
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

export const validateEmailInput = (data) => {
  let errors: EmailErrors = {};

  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = 'Email is invalid';
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Email field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};

export const validatePasswordInput = (data) => {
  let errors: PasswordErrors = {};

  data.password = !isEmpty(data.password) ? data.password : '';
  data.password2 = !isEmpty(data.password2) ? data.password2 : '';

  if (!Validator.isLength(data.password, { min: 6, max: 32 })) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password2 = 'Passwords must match';
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password2 = 'Confirm Password field is required';
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
