export class Config {
  public static WEB_URL = process.env.HEROKU_APP_NAME
    ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
    : process.env.WEB_URL;
  public static OPENAPI_USERNAME = process.env.OPENAPI_USERNAME ?? 'user';
  public static OPENAPI_PASSWORD = process.env.OPENAPI_PASSWORD ?? 'password';
}
