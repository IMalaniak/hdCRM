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

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, './dist/webApp/index.html'));
});

if (process.env.NODE_ENV !== 'production') {
  // //Start DB
  db.sequelize.sync({
    //alter: true,
    //force: true
  }).then(() => {
    app.listen(process.env.PORT, () => {
      console.log('Express listening on port:', process.env.PORT);
    });
  });
} else {
  app.listen(process.env.PORT, () => {
    console.log('Express listening on port:', process.env.PORT);
  });
}

