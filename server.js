const express = require('express');
const logger = require('morgan'); 
const documents = require('./app/routes/documents'); 
const users = require('./app/routes/users');
const bodyParser = require('body-parser');
const mongoose = require('./app/api/config/database'); //database configuration
var jwt = require('jsonwebtoken');
const app = express();

// Habilitanto Cors para aplicações front
var cors=require('cors'); 
app.use(cors({origin:true,credentials: true}));



app.set('secretKey', 'nodeRestApi'); // jwt secret token


// Adicionando os headers a requisição
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Pass to next layer of middleware
    next();
});


// connection to mongodb
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', function (req, res) {
    res.json({ "Alink Digital": "Api de usuários" });
});



// public route
app.use('/users', users);


// private route
app.use('/documents', validateUser, documents);
app.get('/favicon.ico', function (req, res) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    next();
    res.sendStatus(204);
});

 
function validateUser(req, res, next) {
    jwt.verify(req.headers['x-access-token'], req.app.get('secretKey'), function (err, decoded) {
        if (err) {
            res.json({ status: "error", message: err.message, data: null });
        } else {
            // add user id to request
            req.body.userId = decoded.id;
            next();
        }
    });

}
// express doesn't consider not found 404 as an error so we need to handle 404 explicitly
// handle 404 error
app.use(function (req, res, next) {
    let err = new Error('Não encontrado');
    err.status = 404;
    next(err);
});


// handle errors
app.use(function (err, req, res, next) {
    console.log(err);

    if (err.status === 404)
        res.status(404).json({ message: "Não encontrado" });
    else
        res.status(500).json({ message: "Algo está errado :( !!!" });
});
app.listen(process.env.PORT || 3000, function () {
    console.log('Api funcionando na porta 3000');
});

