const express = require('express');
const router = express.Router();
const multer = require('multer');
const models = require('../models/index');
const passport = require('passport');
const path = require('path');


const store = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null, express.static(path.join(__dirname, 'uploads/')));
    },
    filename:function(req,file,cb){
        cb(null, file.originalname);
    }
});

const upload = multer({storage:store}).single('file');

router.post('/upload/avatar', function(req,res,next){
    upload(req,res,function(err){
        if(err){
            return res.status(501).json({error:err});
        }
        //do all database record saving activity
        return res.json({originalname: req.file.originalname, filename: req.file.filename});
    });
});


router.post('/download', function(req,res,next){
    filepath = express.static(path.join(__dirname, 'uploads')) +'/'+ req.body.filename;
    res.sendFile(filepath);
});

module.exports = router;
