import { Response } from 'express';
import { authCheck, ReqType } from '../middleware/auth';

const me = (
  _: void,
  args: any,
  { req, res }: { req: ReqType; res: Response }
) => {
  authCheck(req, res);
  return 'Ray';
};

module.exports = {
  Query: {
    me,
  },
};
