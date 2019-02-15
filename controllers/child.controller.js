var config = require('config.json');
var express = require('express');
var router = express.Router();
var childService = require('services/child.service');

// routes

router.post('/create', create);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/:_id', findOne);
router.get('/all/:parentId', findMany);

module.exports = router;

function findMany(req, res) {
    childService.getByParentId(req.params.parentId)
    .then(function (child){
        if (child) {
            res.send(child);
        }
        else{
            res.sendStatus(404);
        }
    })
    .catch(function (err){
        res.status(400).send(err);
    });
}

function findOne(req, res ) {
    childService.getById(req.params._id)
        .then(function (child) {
            if (child) {
                res.send(child);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



function create(req, res) {
    childService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    childService.getAll()
        .then(function (children) {
            res.send(children);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    childService.getById(req.child.sub)
        .then(function (child) {
            if (child) {
                res.send(child);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function update(req, res) {
    childService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    childService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}