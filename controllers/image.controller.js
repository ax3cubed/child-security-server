var config = require('config.json');
var express = require('express');
var router = express.Router();
var imageService = require('services/image.service');
//var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;


var fs= require('fs');
var multer= require('multer');
var util = require('util');
var upload = multer({
    limits:{fileSize:200000}, 
    dest:'/uploads/'
});
router.post('/:id/create',upload.single('picture'), create);
router.get('/', getImages);


module.exports = router;

function getImages(req, res) {
    
}

function create(req, res) {
    if (req.file== null) {
        res.status(401).send("select an image to upload");
    }
    else{
      imageService.create(req.body);
        
    }
}