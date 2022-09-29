import { Response } from 'express';
import jwt from 'jsonwebtoken';

type UserDetails = {
  _id: string;
  name: string;
  email: string;
  avatar: string;
};

export const authGen = (userDetails: UserDetails, res: Response) => {
  const token = jwt.sign(userDetails, process.env.JWT_SECRET!, {
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
