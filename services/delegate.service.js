var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('delegates');

var service = {};


service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getByParentId = getByParentId;


module.exports = service;

function getByParentId(_parentId) {
    var deferred = Q.defer();

    db.delegates.find({ parentId: _parentId, deleted: false }).toArray(function (err, delegates) {
        if (err) deferred.reject(err.name + ': ' + err.message);
        deferred.resolve(delegates);
    });

    return deferred.promise;

}



function getAll() {
    var deferred = Q.defer();

    db.delegates.find().toArray(function (err, delegates) {
        if (err) deferred.reject(err.name + ': ' + err.message);
         deferred.resolve(delegates);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.delegates.findById(_id, function (err, delegate) {
        if (err) deferred.reject(err.name + ': ' + err.message);
    
    if (delegate) {
        deferred.resolve(delegate);
    } else {
        deferred.resolve();
    }
});

return deferred.promise;
}
function create(delegateParam) {
    var deferred = Q.defer();
    db.delegates.findOne(
        { firstname: delegateParam.firstname, parentId: delegateParam.parentId },
        function (err, delegate) {
            if (err) deferred.reject(err.name + ': ' + err.message);
            if (delegate) {
                //child already exists
                deferred.reject('this Helper or Delegate with firstname ' + delegateParam.firstname + ' already exists');

            } else {
                createDelegate();
            }

        });

    function createDelegate() {
        var delegate = delegateParam;
        delegate.deleted = false;
        db.delegates.insert(
            delegate,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function update(_id, delegateParam) {
    var deferred = Q.defer();
db.delegates.findById(_id, function (err, delegate) {
    if (err) deferred.reject(err.name +': ' + err.message);
    if (delegate.firstname !=delegateParam.firstname) {
        //delegate taken
        db.delegates.findOne(
            {firstname:delegateParam.firstname,parentId:delegateParam.parentId},
            function (err, delegate) {
                if (err) deferred.reject(err.name+ ': '+ err.message);
                if (delegate) {
                    deferred.reject('this firstname "'+delegateParam.firstname+'" is already taken');
                    
                }
                else{
                    updateDelegate();
                }
                
                
            });
    } else {
        updateDelegate();
    }
})

    function updateDelegate() {
        // fields to update
        var set = {
            
            firstname: delegateParam.firstname,
            parentId:delegateParam.parentId,
            middlename:delegateParam.middlename,
            lastname: delegateParam.lastname,
            helper_relationship:delegateParam.helper_relationship,
            photo:delegateParam.picture,
            date_of_birth:delegateParam.date_of_birth,
            deleted:delegateParam.deleted,
            

        };

       

        db.delegates.update(
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

    db.delegates.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}