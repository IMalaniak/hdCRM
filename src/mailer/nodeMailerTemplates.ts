import Email from 'email-templates';
import * as db from '../models';
import path from 'path';

class Mailer {
  sender = process.env.NODE_MAILER_SENDER;
  password = process.env.NODE_MAILER_PASSWORD;

  newEmail = new Email({
    message: {
      from: `HDCRM <${this.sender}>`
    },
    // uncomment below to send emails in development/test env:
    // send: false,
    // preview: true,
    send: process.env.NODE_ENV === 'production' ? true : false,
    preview: process.env.NODE_ENV !== 'production' ? true : false,
    transport: {
      host: process.env.NODE_MAILER_HOST,
      port: 465,
      secure: true,  // true for 465 port, false for other ports
      auth: {
          user: this.sender,
          pass: this.password
      }
    }
  });

  constructor() {

  }

  sendPasswordReset(user: db.User, tokenUrl: string): Promise<Email> {
    return this.newEmail.send({
      template: path.join(__dirname, '../../emails', 'resetPassword'),
      message: {
        subject: 'Reset Password request',
        to: user.email
      },
      locals: {
        name: user.name,
        username: user.login,
        token: tokenUrl
      }
    });
  }

  sendPasswordResetConfirmation(user: db.User): Promise<Email> {
    return this.newEmail.send({
      template: path.join(__dirname, '../../emails', 'resetPasswordConfirmation'),
      message: {
        subject: 'Password reset confirmation',
        to: user.email
      },
      locals: {
        name: user.name,
        username: user.login
      }
    });
  }

  sendActivation(user: db.User, tmpPassword: string, url: string) {
    return this.newEmail.send({
      template: path.join(__dirname, '../../emails', 'initActivation'),
      message: {
        subject: 'Welcome to HDCRM',
        to: user.email
      },
      locals: {
        name: user.name,
        username: user.login,
        tmpPass: tmpPassword,
        activationUrl: url
      }
    });
  }

  sendActivationConfirmation(user: db.User) {
    return this.newEmail.send({
      template: path.join(__dirname, '../../emails', 'confirmActivation'),
      message: {
        subject: 'Good job activating your HDCRM',
        to: user.email
      },
      locals: {
        name: user.name,
        username: user.login
      }
    });
  }
}

export default new Mailer();
