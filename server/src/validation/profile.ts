import Validator from 'validator';
import { EditProfileArgs } from '../resolvers/profile';
import { isEmpty } from './is-empty';

type Errors =
  | {
      handle?: string;
      status?: string;
      skills?: string;
      website?: string;
      youtube?: string;
      twitter?: string;
      facebook?: string;
      linkedin?: string;
      instagram?: string;
    }
  | undefined;

export const validateProfileInput = (data: EditProfileArgs) => {
  let {
    handle,
    status,
    skills,
    website,
    youtube,
    twitter,
    facebook,
    linkedin,
    instagram,
  } = data.input;
  let errors: Errors = {};

  handle = !isEmpty(handle) ? handle : '';
  status = !isEmpty(status) ? status : '';
  skills = !isEmpty(skills) ? skills : '';

  if (!Validator.isLength(handle, { min: 2, max: 40 })) {
    errors.handle = 'Handle needs to be between 2 and 4 characters';
  }

  if (Validator.isEmpty(handle)) {
    errors.handle = 'Profile handle is required';
  }

  if (Validator.isEmpty(status)) {
    errors.status = 'Status field is required';
  }

  if (Validator.isEmpty(skills)) {
    errors.skills = 'Skills field is required';
  }

  if (!isEmpty(website)) {
    if (!Validator.isURL(website, { require_protocol: true })) {
      errors.website = 'Enter valid url including http://www. or https://www.';
    }
  }

  if (!isEmpty(youtube)) {
    if (!Validator.isURL(youtube, { require_protocol: true })) {
      errors.youtube = 'Enter valid url including http://www. or https://www.';
    }
  }

  if (!isEmpty(twitter)) {
    if (!Validator.isURL(twitter, { require_protocol: true })) {
      errors.twitter = 'Enter valid url including http://www. or https://www.';
    }
  }

  if (!isEmpty(facebook)) {
    if (!Validator.isURL(facebook, { require_protocol: true })) {
      errors.facebook = 'Enter valid url including http://www. or https://www.';
    }
  }

  if (!isEmpty(linkedin)) {
    if (!Validator.isURL(linkedin, { require_protocol: true })) {
      errors.linkedin = 'Enter valid url including http://www. or https://www.';
    }
  }

  if (!isEmpty(instagram)) {
    if (!Validator.isURL(instagram, { require_protocol: true })) {
      errors.instagram =
        'Enter valid url including http://www. or https://www.';
    }
  }

  return {
    errors,
    isValid: isEmpty(errors),
  };
};
