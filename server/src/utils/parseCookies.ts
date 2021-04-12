import { Request } from 'express';

export const parseCookies = (request: Request): { [key: string]: string } => {
  const list = {};
  const rc = request.headers.cookie;

  if (rc) {
    rc.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
  }

  return list;
};
