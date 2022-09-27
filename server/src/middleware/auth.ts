import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type DualNextType = (() => null) | NextFunction;
export type ReqType = Request & { user: string | jwt.JwtPayload | undefined };

export const authCheck = (
  req: ReqType,
  res: Response,
  next: DualNextType = () => null
) => {
  // Look at the HTTP Headers for an auth cookie and if none is found then throw an error
  const { cookie } = req.headers;
  if (cookie == undefined) return res.sendStatus(401);

  // This is where we'll reach out to firebase to validate the token. For now we'll just hard code a valid authtoken
  const token = cookie.split('token=')[1].split(';')[0];

  if (process.env.JWT_SECRET) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log('error', err);

      if (err) return res.sendStatus(403);
      // if success upon verification,
      // issue new 'token' and 'checkToken'
      req.user = user;

      next();
    });
  }
};
