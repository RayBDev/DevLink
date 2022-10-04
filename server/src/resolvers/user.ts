import { IResolvers } from '@graphql-tools/utils';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
} from 'graphql-scalars';
import { UserInputError } from 'apollo-server-core';
import jwt from 'jsonwebtoken';
import Validator from 'validator';

import { User } from '../models/User';
import sendEmail from '../email';
import { authGen, JWTPayloadType } from '../auth/authGen';

// @desc    Return current user
// @access  Private
const current = async (
  _: void,
  args: any,
  { res, user }: { res: Response; user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('User not logged in');

  try {
    const userFromDatabase = await User.findOne({ _id: user._id });

    // Generate JWT and send cookies
    authGen(
      {
        _id: user._id,
      },
      res
    );

    return userFromDatabase;
  } catch (err) {
    throw new UserInputError('User does not exist');
  }
};

// Argument Types Received for Register Mutation
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
  const { name, email, password, password2 } = args.input;

  if (
    !Validator.isLength(name, { min: 2, max: 30 }) ||
    !Validator.isLength(password, { min: 8, max: 32 }) ||
    !Validator.equals(password, password2)
  ) {
    throw new UserInputError('Invalid registration details');
  }

  // Try to find existing user by email
  const user = await User.findOne({ email });

  // If user is found then throw error otherwise get gravatar image
  if (user) {
    throw new UserInputError('Email already exists');
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
      },
      res
    );
    return newUser;
  }
};

// Argument Types Received for Login Mutation
export type LoginArgs = {
  input: {
    email: string;
    password: string;
  };
};

// @desc    Login user / Returning JWT Token
// @access  Public
const login = async (_: void, args: LoginArgs, { res }: { res: Response }) => {
  const { email, password } = args.input;

  // Find user by email
  const user = await User.findOne({ email });

  // Check if user exists and throw error if not
  if (!user) {
    throw new UserInputError('Invalid login details');
  }

  // Check Password against hash
  const isMatch = await bcrypt.compare(password, user.hash);
  if (isMatch) {
    // If passwords match generate new JWT and respond with cookies
    authGen(
      {
        _id: user.id,
      },
      res
    );
    return user;
  } else {
    // If password doesn't match hash, throw new error
    throw new UserInputError('Invalid login details');
  }
};

// Argument Types Received for ForgetPW Mutation
export type ForgetPWArgs = {
  input: {
    email: string;
  };
};

// @desc    Check user email and send reset password email
// @access  Public
const forgetpw = async (_: void, args: ForgetPWArgs) => {
  const { email } = args.input;

  const user = await User.findOne({ email });

  // Check for user and return 'Success' if not found
  if (!user) {
    return { result: 'Success' };
  }

  const payload = { _id: user._id }; // Create JWT Payload

  // Sign Token
  const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: 600 });

  // The lines below are for a simulated SMTP service. This can be replaced by a real SMTP service for production
  const subject = 'Password reset link - example.com';
  const message = `Please <a href="http://localhost:3000/resetpw/?reset=${token};">click here</a> to reset your password`;

  try {
    await sendEmail(user.name, user.email, subject, message);
    return { result: 'Success' };
  } catch (err) {
    throw new UserInputError('Email service down');
  }
};

// Argument Types Received for ForgetPW Mutation
export type ResetPWArgs = {
  input: {
    password: string;
    password2: string;
  };
};

// @desc    Reset user password
// @access  Public
const resetpw = async (
  _: void,
  args: ResetPWArgs,
  { user }: { user: JWTPayloadType }
) => {
  if (!user) throw new UserInputError('Email link invalid or expired');

  const { password, password2 } = args.input;

  if (!Validator.equals(password, password2)) {
    throw new UserInputError('Emails do not match');
  }

  // Hash password
  const hash = await bcrypt.hash(password, 10);

  const userFromDatabase = await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { hash } },
    { new: true }
  );

  if (!userFromDatabase) throw new UserInputError('Invalid email');

  return { result: 'Success' };
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
    forgetpw,
    resetpw,
  },
};

module.exports = resolverMap;