const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const db = require('./server/models/index');
const api = require('./server/routes');
const app = express();

//CORS Middleware
app.use(cors());

//Ser static folder
app.use(express.static(path.join(__dirname, './dist/webApp')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport);

app.use('/api', api);


const port = parseInt(process.env.PORT);
if (port !== 'production') {
  // //Start DB
  db.sequelize.sync({
    //alter: true,
    //force: true
  }).then(() => {
    app.listen(port, () => {
      console.log(`Express listening on port: ${port}`);
    });
  });
} else {
  app.listen(port, () => {
    console.log(`Express listening on port: ${port}`);
  });
}

