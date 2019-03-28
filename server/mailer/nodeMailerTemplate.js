
const mailer = {};
const sender = 'auth@mywebmaster.pp.ua';
const password = 'authmaster';

const Email = require('email-templates');
const newEmail = new Email({
  message: {
    from: `HDCRM <${sender}>`
  },
  // uncomment below to send emails in development/test env:
  //send: false,
  //preview: true,
  send: true,
  preview: false,
  transport: {
    host: 'h1.hitme.pl',
    port: 465,
    secure: true,  //true for 465 port, false for other ports
    auth: {
        user: sender,
        pass: password
    }
  }
});

mailer.sendPasswordReset = function (user, tokenUrl) {
  return newEmail.send({
    template: 'resetPassword',
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
};

mailer.sendPasswordResetConfirmation = function(user) {
  return newEmail.send({
    template: 'resetPasswordConfirmation',
    message: {
      subject: 'Password reset confirmation',
      to: user.email
    },
    locals: {
      name: user.name,
      username: user.login
    }
  });
};

mailer.sendActivation = function(user, tmpPassword, url) {
  return newEmail.send({
    template: 'initActivation',
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
};

mailer.sendActivationConfirmation = function(user) {
  return newEmail.send({
    template: 'confirmActivation',
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

module.exports = mailer;