export const parseCookies = request => {
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
