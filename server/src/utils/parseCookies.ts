import { Request } from 'express';

interface ParsedCookies {
  [key: string]: string;
}

export const parseCookies = (request: Request): ParsedCookies => {
  const list: ParsedCookies = {};
  const rc = request.headers.cookie;

  if (rc) {
    rc.split(';').forEach((cookie: string) => {
      const parts = cookie.split('=');
      const index = parts.shift()?.trim();
      if (index) {
        list[index] = decodeURI(parts.join('='));
      }
    });
  }

  return list;
};
