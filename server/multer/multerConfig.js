
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const multerConfig = {};

const uploadsFolder = path.join(__dirname, '../../uploads');

const store = multer.diskStorage({
    destination: function(req, file, cb) {
        let dest;
        if (req.url.includes('avatar')) {
            dest = `${uploadsFolder}/images/userpic`;
        } else {
            dest = file.mimetype.includes('image/') ? `${uploadsFolder}/images` : `${uploadsFolder}/docs`;
        }
        cb(null, dest);
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

multerConfig.upload = multer({storage: store});

module.exports = multerConfig;