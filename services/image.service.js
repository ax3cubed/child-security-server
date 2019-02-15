var config = require('config.json');
var _ = require('lodash');
const multer = require('multer');
const path = require('path');
const UPLOAD_PATH = path.resolve(__dirname,'uploads');
const upload = multer({
    dest: UPLOAD_PATH,
    limits: {fieldSize:1000000, files:5}
});
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('images');

var service = {};


service.getAll = getAll;
service.getById = getById;
service.create = create;
service.update = update;
service.delete = _delete;
service.getByParentId = getByParentId;

function create(parentId, formData) {
    var deferred = Q.defer();

    db.images.findOne(
        {parentId: parentId},
        function (err, image) {
            if (err) deferred.reject(err.name + ': '+ err.message);
            if (image){
                deferred.reject('this user already has a passport');
            }
            else{
                createImage();
            }
        }
    );
    function createImage() {
  

        db.images.insert(
            parentId,formData,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': '+ err.message);
                deferred.resolve();
                
            }
        );
        return deferred.promise;
    }
}