var config = require('config.json');
var express = require('express');
var router = express.Router();
var delegateService = require('services/delegate.service');

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
    delegateService.getByParentId(req.params.parentId)
        .then(function (delegate) {
            if (delegate) {
                res.send(delegate);
            }
            else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}


function findOne(req, res ) {
    delegateService.getById(req.params._id)
        .then(function (delegate) {
            if (delegate) {
                res.send(delegate);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}



function create(req, res) {
    delegateService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getAll(req, res) {
    delegateService.getAll()
        .then(function (delegates) {
            res.send(delegates);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrent(req, res) {
    delegateService.getById(req.delegate.sub)
        .then(function (delegate) {
            if (delegate) {
                res.send(delegate);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function update(req, res) {
    delegateService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function _delete(req, res) {
    delegateService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}