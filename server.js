require('rootpath')();
var express = require('express');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require('config.json');
var MongoClient = require('mongodb').MongoClient;

//connect to the db

MongoClient.connect("mongodb://localhost:27017/childserver", function (err, db) {
    if (!err) {
        console.log("child server is connected");
    }
    else {
        console.log(err);
    }
});
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// // use JWT auth to secure the api
app.use(expressJwt({
    secret: config.secret,
    getToken: function (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}).unless({
    path: ['/parent/authenticate',
        '/child/create',
        '/child/',
        
        '/parent/register',
        '/admin/authenticate',
        '/admin/register',]
}));

// routes
app.use('/parent', require('./controllers/parent.controller'));
app.use('/child', require('./controllers/child.controller'));
app.use('/delegate', require('./controllers/delegate.controller'));
app.use('/collection', require('./controllers/collection.controller'));
app.use('/admin', require('./controllers/admin.controller'));
// start server
var port = process.env.NODE_ENV === 'production' ? 80 : 3000;
var server = app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
