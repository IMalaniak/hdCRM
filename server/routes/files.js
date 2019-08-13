const express = require('express');
const router = express.Router();

const db = require('../models/index');
const passport = require('passport');
const path = require('path');

const destination = path.join(__dirname, '../../uploads');

router.get('/download/:fileID', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    db.Asset.findByPk(req.params.fileID).then(file => {
        const filepath =  destination + file.location + '/' + file.title;
        res.download(filepath);
    }).catch(error => {
		res.status(400).json(error.toString());
	});
});

module.exports = router;
