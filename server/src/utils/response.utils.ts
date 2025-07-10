import { Response } from 'express';

export const setResponseMeta = (
  res: Response,
  key: string = 'data',
  message: string = 'Request successful'
) => {
  res.locals.key = key;
  res.locals.message = message;
};
