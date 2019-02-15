var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('collections');

var service = {};


service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getByParentId=getByParentId;


module.exports = service;

function getByParentId(_parentId) {
    var deferred =Q.defer();

    db.collections.find({parentId:_parentId, deleted:false}).toArray(function (err, collections) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(collections);
    });
    return deferred.promise;
}

function getAll() {
    var deferred = Q.defer();

    db.collections.find().toArray(function (err, collections) {
        if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(collections);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.collections.findById(_id, function (err, collection) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    });

    return deferred.promise;
}

function create(collectionParam) {
    var deferred = Q.defer();
    // validation
    this.collections.findOne(
        {attendant_id:collectionParam.attendant_id,parent_id:collectionParam.parent_id,pick_up_time:collectionParam.pick_up_time},
        function (err, collection) {
            if(err) deferred.reject(err.name+ ': '+err.message);
            if(collection){
             deferred.reject('this collection with this time ' + collectionParam.pick_up_time);
            }
            else{
                createCollection();
            }
        });


    function createCollection() {
        var collection = collectionParam;
        collection.deleted=false;
       db.collections.insert(
            collection,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, collectionParam) {
    var deferred = Q.defer();
      
        var set = {
            
            picked_up_by:collectionParam.picked_up_by,
            verified_by:collectionParam.verified_by,
            parentId:collectionParam.parentId,
            parent_verified:collectionParam.parent_verified,
            helper_influence:collectionParam.helper_influence,
            helper_id:collectionParam.helper_id,
            pick_up_time:collectionParam.pick_up_time,
            helper_verified:collectionParam.helper_verified

        };
        db.collections.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
         
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.collections.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}