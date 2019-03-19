const api = require('express').Router();

const users = require('./users');
const roles = require('./roles');
const privileges = require('./privileges');
const states = require('./states');
const stages = require('./stages');
const plans = require('./plans');
const files = require('./files');
const departments = require('./departments');


api.get('/', (req, res) => {
    res.status(200).json({ message: 'Connected!' });
});
api.use('/users', users);
api.use('/roles', roles);
api.use('/privileges', privileges);
api.use('/states', states);
api.use('/stages', stages);
api.use('/plans', plans);
api.use('/departments', departments);
api.use('/files', files);

module.exports = api;