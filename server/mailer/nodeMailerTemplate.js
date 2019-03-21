
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

mailer.sendPasswordReset = function (email, username, name, tokenUrl) {
  return newEmail.send({
    template: 'resetPassword',
    message: {
      subject: 'Reset Password request',
      to: email
    },
    locals: {
      name: name,
      username: username,
      token: tokenUrl
    }
  });
};

mailer.sendPasswordResetConfirmation = function(email, username, name) {
  return newEmail.send({
    template: 'resetPasswordConfirmation',
    message: {
      subject: 'Password reset confirmation',
      to: email
    },
    locals: {
      name: name,
      username: username
    }
  });
};

module.exports = mailer;