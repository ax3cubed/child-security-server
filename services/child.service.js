var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('children');

var service = {};


service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getByParentId =getByParentId;



module.exports = service;



function getByParentId(_parentId,) {
    var deferred = Q.defer();

    db.children.find({ parentId: _parentId, deleted: false }).toArray(function (err, children) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(children);
    });

    return deferred.promise;
    
}

function getAll() {
    var deferred = Q.defer();

    db.children.find().toArray(function (err, children) {
        if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(children);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.children.findById(_id, function (err, child) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        if (child) {
            deferred.resolve(child);
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(childParam) {
    var deferred = Q.defer();
          db.children.findOne(
    {firstname:childParam.firstname, parentId:childParam.parentId},
    function (err, child) {
        if (err) deferred.reject(err.name+ ': '+ err.message);
        if (child) {
            //child already exists
            deferred.reject('this child with firstname ' + childParam.firstname+ ' already exists');

        }else{
            createChild();
        }
        
    });

    function createChild() {
        var child= childParam;
        child.deleted=false;
       db.children.insert(
            child,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, childParam) {
    var deferred = Q.defer();
    db.children.findById(_id, function (err, child) {
        if (err) deferred.reject(err.name +': ' + err.message);
        if (child.firstname !=childParam.firstname) {
            //childs name has been taken so check if the new childs name is also taken
            db.children.findOne(
                { firstname: childParam.firstname, parentId: childParam.parentId },
                function (err, child) {
                    if (err) deferred.reject(err.name+ ': '+ err.message);
                    if (child) {
                        deferred.reject('this firstname "' + childParam.firstname +'"  is already taken')
                    } else {
                        updateChild();
                    }
                });
        } else {
            updateChild();
            
        }
    });

    function updateChild() {
        // fields to update
        var set = {
            
            firstname: childParam.firstname,
            parentId:childParam.parentId,
            middlename:childParam.middlename,
            lastname: childParam.lastname,
            picture:childParam.picture,
            date_of_birth:childParam.date_of_birth,
            deleted:childParam.deleted,
            

        };

       

        db.children.update(
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

    db.children.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}