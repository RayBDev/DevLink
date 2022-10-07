import { IResolvers } from '@graphql-tools/utils';
import { Response } from 'express';
import bcrypt from 'bcryptjs';
import gravatar from 'gravatar';
import {
  DateTimeResolver,
  EmailAddressResolver,
  URLResolver,
} from 'graphql-scalars';
import { UserInputError, AuthenticationError } from 'apollo-server-core';
import jwt from 'jsonwebtoken';
import Validator from 'validator';

import { User } from '../models/User';
import sendEmail from '../email';
import { authGen, JWTPayloadType } from '../auth/authGen';

// @type    Query
// @desc    Return current user
// @access  Private
const current = async (
  _: void,
  args: any,
  { res, user }: { res: Response; user: JWTPayloadType }
) => {
  // Check if user is logged in and throw error if not
  if (!user) throw new AuthenticationError('User not logged in');

  // Find the user in the database and return that user along with a refreshed set of cookies
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

// @type    Mutation
// @desc    Register a user
// @access  Public
const register = async (
  _: void,
  args: RegisterArgs,
  { res }: { res: Response }
) => {
  const { name, email, password, password2 } = args.input;

  // Check the name and password provided by the user
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

    // Generate JWT and set cookies that will get sent when function returns
    authGen(
      {
        _id: newUser.id,
      },
      res
    );

    // Save new user and send cookies
    return await newUser.save();
  }
};

// Argument Types Received for Login Mutation
export type LoginArgs = {
  input: {
    email: string;
    password: string;
  };
};

// @type    Mutation
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
    // If passwords match generate new JWT cookies and return user along with cookies
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

// @type    Mutation
// @desc    Check user email and send reset password email
// @access  Public
const forgetpw = async (_: void, args: ForgetPWArgs) => {
  const { email } = args.input;

  const user = await User.findOne({ email });

  // Check for user and return 'Success' if not found but a reset email will not be sent
  // Client will respond that an email has been sent if email exists in the database
  if (!user) {
    return { result: 'Success' };
  }

  const payload = { _id: user._id }; // Create JWT Payload

  // Sign Token with 1Hr expiry
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

// @type    Mutation
// @desc    Reset user password
// @access  Public
const resetpw = async (
  _: void,
  args: ResetPWArgs,
  { user }: { user: JWTPayloadType }
) => {
  // Throw an error if the JWT token in the email link has expired
  if (!user) throw new AuthenticationError('Email link invalid or expired');

  const { password, password2 } = args.input;

  // Check if the password and confirmation password match
  if (!Validator.equals(password, password2)) {
    throw new UserInputError('Emails do not match');
  }

  // Hash the new password
  const hash = await bcrypt.hash(password, 10);

  // Update the user's password in MongoDB
  const userFromDatabase = await User.findByIdAndUpdate(
    { _id: user._id },
    { $set: { hash } },
    { new: true }
  );

  // Throw new error in case the user was deleted before a password can be reset
  if (!userFromDatabase) throw new UserInputError('User no longer exists');

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
