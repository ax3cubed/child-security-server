var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('parents');

var service = {};

service.authenticate = authenticate;
service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;


module.exports = service;

function authenticate(email, password) {
    var deferred = Q.defer();

    db.parents.findOne({ email:email }, function (err, parent) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (parent && bcrypt.compareSync(password, parent.hash)) {
            // authentication successful
            deferred.resolve({
                _id: parent._id,
                
                firstName: parent.firstName,
                lastName: parent.lastName,
                email: parent.email,
                token: jwt.sign({ sub: parent._id }, config.secret)
            });
        } else {
            // authentication failed
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.parents.find().toArray(function (err, parents) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        // return parents (without hashed passwords)
        parents = _.map(parents, function (parent) {
            return _.omit(parent, 'hash');
        });

        deferred.resolve(parents);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.parents.findById(_id, function (err, parent) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (parent) {
            // return parent (without hashed password)
            deferred.resolve(_.omit(parent, 'hash'));
        } else {
            // parent not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(parentParam) {
    var deferred = Q.defer();

    // validation
    db.parents.findOne(
        { email: parentParam.email},
        function (err, parent) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (parent) {
                // parentname already exists
                deferred.reject('this email address  "' + parentParam.email+ '" is already taken');
            } else {
                createparent();
            }
        });

    function createparent() {
        // set parent object to parentParam without the cleartext password
        var parent = _.omit(parentParam, 'password');
        

        // add hashed password to parent object
        parent.hash = bcrypt.hashSync(parentParam.password, 10);

        db.parents.insert(
            parent,
            
            
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, parentParam) {
    var deferred = Q.defer();

    // validation
    db.parents.findById(_id, function (err, parent) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (parent.email !=parentParam.email) {
            // parentname has changed so check if the new parentname is already taken
            db.parents.findOne(
                { email: parentParam.email },
                function (err, parent) {
                    if (err) deferred.reject(err.name + ': ' + err.message);
                    if (parent) {
                        // parentname already exists
                        deferred.reject('This email adresss"' + req.body.email + '" is already taken')
                    } else {
                        updateparent();
                    }
                });
        } else {
            updateparent();
        }
    });

    function updateparent() {
        // fields to update
        var set = {
            email: parentParam.email,
            firstName: parentParam.firstName,
            middlename:parentParam.middlename,
            lastName: parentParam.lastName,
            phoneNumber:parentParam.phoneNumber,
            password:parentParam.password,
            about:parentParam.about,
            streetName:parentParam.streetName,
            city:parentParam.city,
            country:parentParam.country,
            profilePic:parentParam.profilePic,
            isActive:parentParam.isActive,
            

        };

        // update password if it was entered
        if (parentParam.password) {
            set.hash = bcrypt.hashSync(parentParam.password, 10);
        }

        db.parents.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
         
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
           
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.parents.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}