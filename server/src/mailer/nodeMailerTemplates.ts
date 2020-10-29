import Email from 'email-templates';
import path from 'path';
import { Service } from 'typedi';

import { User } from '../models';

@Service({ global: true })
export class Mailer {
  sender = process.env.NODE_MAILER_SENDER;
  password = process.env.NODE_MAILER_PASSWORD;

  newEmail = new Email({
    message: {
      from: `HDCRM <${this.sender}>`
    },
    // uncomment below to send emails in development/test env:
    // send: false,
    // preview: true,
    send: process.env.NODE_ENV === 'development' ? false : true,
    preview: process.env.NODE_ENV === 'development' ? true : false,
    transport: {
      host: process.env.NODE_MAILER_HOST,
      port: 465,
      secure: true, // true for 465 port, false for other ports
      auth: {
        user: this.sender,
        pass: this.password
      }
    }
  });

  sendPasswordReset(user: User, tokenUrl: string): Promise<void> {
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

  sendPasswordResetConfirmation(user: User): Promise<void> {
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

  sendActivation(user: User, tmpPassword: string, url: string): Promise<void> {
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

  sendActivationConfirmation(user: User): Promise<void> {
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

  sendInvitation(params: { user: User; tmpPassword: string; url: string }): Promise<void> {
    const { user, tmpPassword, url } = params;
    return this.newEmail.send({
      template: path.join(__dirname, '../../emails', 'userInvitation'),
      message: {
        subject: 'You have been invited to HDCRM system',
        to: user.email
      },
      locals: {
        organization: user.Organization.title,
        email: user.email,
        name: user.name,
        username: user.login,
        tmpPass: tmpPassword,
        activationUrl: url
      }
    });
  }
}
