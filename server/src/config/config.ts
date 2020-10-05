export class Config {
  public static WEB_URL = process.env.HEROKU_APP_NAME
    ? `https://${process.env.HEROKU_APP_NAME}.herokuapp.com`
    : process.env.WEB_URL;
}
