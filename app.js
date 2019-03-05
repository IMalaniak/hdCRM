const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const env = require('./server/config/env');
const db = require('./server/models/index');

const app = express();

const users = require('./server/routes/users');
const roles = require('./server/routes/roles');
const privileges = require('./server/routes/privileges');
const states = require('./server/routes/states');
const stages = require('./server/routes/stages');
const plans = require('./server/routes/plans');
const files = require('./server/routes/files');
const departments = require('./server/routes/departments');

//Port #
const PORT = process.env.PORT || env.PORT;

//CORS Middleware
app.use(cors());

//Ser static folder
app.use(express.static(path.join(__dirname, './dist/webApp')));
app.use('/userpics', express.static(path.join(__dirname, './uploads/images/userpic/')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./server/config/passport')(passport);

app.use('/users', users);
app.use('/roles', roles);
app.use('/privileges', privileges);
app.use('/states', states);
app.use('/stages', stages);
app.use('/plans', plans);
app.use('/departments', departments);
app.use('/files', files);

app.get('/', (req, res) => {
	res.send('Invalid');
});

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, './dist/webApp/index.html'));
});

// //Start DB
db.sequelize.sync({
	//alter: true,
	//force: true
}).then(() => {
  app.listen(PORT, () => {
    console.log('Express listening on port:', PORT);
  });
});
