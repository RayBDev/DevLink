import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

export type JWTPayloadType = {
  _id: Types.ObjectId;
};

export const authGen = (JWTPayload: JWTPayloadType, res: Response) => {
  const token = jwt.sign(JWTPayload, process.env.JWT_SECRET!, {
    expiresIn: '1800s',
  });

  res
    .cookie('token', token, {
      domain: process.env.DOMAIN_URL,
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
      sameSite: 'none',
    })
    .cookie('checkToken', true, {
      domain: process.env.DOMAIN_URL,
      secure: true,
      expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours,
      sameSite: 'none',
    });
};
