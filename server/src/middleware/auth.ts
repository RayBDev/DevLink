import { UserInputError } from 'apollo-server-core';
import { NextFunction, Request } from 'express';
import jwt from 'jsonwebtoken';

type DualNextType = (() => null) | NextFunction;
export type ReqType = Request & { user: string | jwt.JwtPayload | undefined };

export const authCheck = (req: ReqType, next: DualNextType = () => null) => {
  // Look at the HTTP Headers for an auth cookie and if none is found then throw an error
  const { cookie } = req.headers;
  if (cookie == undefined) throw new UserInputError('User not logged in');

  // Extract the JWT token from the cookie
  const token = cookie.split('token=')[1].split(';')[0];

  // Verify the JWT token and add the user details to the Express Request
  jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
    console.log('error', err);

    if (err) throw new UserInputError('User not logged in');
    // if success upon verification,
    // issue new 'token' and 'checkToken'
    req.user = user;

    next();
  });
};
