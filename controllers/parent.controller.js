﻿var config = require('config.json');
var express = require('express');
var router = express.Router();
var parentservice = require('services/parent.service');


// routes
router.post('/authenticate', authenticate);
router.post('/register', register);
router.get('/', getAll);
router.get('/current', getCurrent);
router.put('/:_id', update);
router.delete('/:_id', _delete);
router.get('/:_id', findOne);



module.exports = router;



function findOne(req, res ) {
    parentservice.getById(req.params._id)
        .then(function (parent) {
            if (parent) {
                res.send(parent);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function authenticate(req, res) {
    parentservice.authenticate(req.body.email, req.body.password)
        .then(function (parent) {
            if (parent) {
                // authentication successful
                res.send(parent);
            } else {
                // authentication failed
                res.status(401).send('Email or password is incorrect');
                
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function register(req, res) {
    parentservice.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    parentservice.getAll()
        .then(function (parents) {
            res.send(parents);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    parentservice.getById(req.parent.sub)
        .then(function (parent) {
            if (parent) {
                res.send(parent);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    parentservice.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    parentservice.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}