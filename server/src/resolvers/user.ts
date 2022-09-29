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

import { authCheck, ReqType } from '../middleware/auth';
import { User } from '../models/User';
import { validateRegisterInput } from '../validation/register';
import { validateLoginInput } from '../validation/login';
import { authGen } from '../auth/authGen';

// @desc    Return current user
// @access  Private
const current = (
  _: void,
  args: any,
  { req, res }: { req: ReqType; res: Response }
) => {
  authCheck(req, res);
  if (req.user) return req.user;
};

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

  const user = await User.findOne({ email });

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

    const hash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      avatar,
      hash,
    });

    await newUser.save();

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

  // Check for user
  if (!user) {
    errors.email = 'Email or password incorrect';
    errors.password = 'Email or password incorrect';
    throw new UserInputError('Invalid login details', { errors });
  }

  // Check Password
  const isMatch = await bcrypt.compare(password, user.hash);
  if (isMatch) {
    // Password Matched
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
    errors.email = 'Email or password incorrect';
    errors.password = 'Email or password incorrect';
    throw new UserInputError('Invalid login details', { errors });
  }
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
