import { IResolvers } from '@graphql-tools/utils';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
} from 'graphql-scalars';
import { UserInputError } from 'apollo-server-core';

import { ReqType } from '../middleware/auth';
import { User } from '../models/User';
import { validateRegisterInput } from '../validation/register';
import { validateLoginInput } from '../validation/login';
import { authGen } from '../auth/authGen';

export type JWTPayloadType = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

// @desc    Return current user
// @access  Private
const current = async (
  _: void,
  args: any,
  { res, user }: { res: Response; user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');
  // Generate JWT and send cookies
  authGen(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar!,
    },
    res
  );
  return user;
};

// Argument Types Received for Register Endpoint
export type RegisterArgs = {
  input: {
    name: string;
    email: string;
    password: string;
    password2: string;
  };
};

// @desc    Register a user
// @access  Public
const register = async (
  _: void,
  args: RegisterArgs,
  { res }: { res: Response }
) => {
  const { errors, isValid } = validateRegisterInput(args);

  //Check Validation
  if (!isValid) {
    throw new UserInputError('Invalid registration details', { errors });
  }

  const { name, email, password } = args.input;

  // Try to find existing user by email
  const user = await User.findOne({ email });

  // If user is found then throw error otherwise get gravatar image
  if (user) {
    errors.email = 'Email already exists';
    throw new UserInputError('Invalid registration details', { errors });
  } else {
    const avatar = gravatar.url(email, {
      protocol: 'https', // URL Protocol
      s: '200', // Size
      r: 'pg', // Rating
      d: 'mm', // Default
    });

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create new user with User Model and add to MongoDB database
    const newUser = new User({
      name,
      email,
      avatar,
      hash,
    });

    await newUser.save();

    // Generate JWT and send cookies
    authGen(
      {
        _id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar!,
      },
      res
    );
    return newUser;
  }
};

// Argument Types Received for Login Endpoint
export type LoginArgs = {
  input: {
    email: string;
    password: string;
  };
};

// @desc    Login user / Returning JWT Token
// @access  Public
const login = async (_: void, args: LoginArgs, { res }: { res: Response }) => {
  const { errors, isValid } = validateLoginInput(args);

  //Check Validation
  if (!isValid) {
    throw new UserInputError('Invalid login details', { errors });
  }

  const { email, password } = args.input;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and throw error if not
  if (!user) {
    errors.email = 'Email or password incorrect';
    errors.password = 'Email or password incorrect';
    throw new UserInputError('Invalid login details', { errors });
  }

  // Check Password against hash
  const isMatch = await bcrypt.compare(password, user.hash);
  if (isMatch) {
    // If passwords match generate new JWT and respond with cookies
    authGen(
      {
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar!,
      },
      res
    );
    return user;
  } else {
    // If password doesn't match hash, throw new error
    errors.email = 'Email or password incorrect';
    errors.password = 'Email or password incorrect';
    throw new UserInputError('Invalid login details', { errors });
  }
};

// Argument Types Received for Login Endpoint
export type NewArgs = {
  input: {
    email: string;
    password: string;
  };
};

const resolverMap: IResolvers = {
  DateTime: DateTimeResolver,
  URL: URLResolver,
  EmailAddress: EmailAddressResolver,
  Query: {
    current,
  },
  Mutation: {
    register,
    login,
  },
};

module.exports = resolverMap;
