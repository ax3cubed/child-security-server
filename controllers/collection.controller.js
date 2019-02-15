var config = require('config.json');
var express = require('express');
var router = express.Router();
var collectionService = require('services/collection.service');

// routes

router.post('/create', create);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/:_id', findOne);

module.exports = router;

function findOne(req, res ) {
    collectionService.getById(req.params._id)
        .then(function (collection) {
            if (collection) {
                res.send(collection);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



function create(req, res) {
    collectionService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    collectionService.getAll()
        .then(function (collections) {
            res.send(collections);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    collectionService.getById(req.collection.sub)
        .then(function (collection) {
            if (collection) {
                res.send(collection);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    collectionService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    collectionService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}