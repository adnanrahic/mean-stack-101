var express = require('express');
var app = express();
var db = require('./db');

var UserController = require('./user/NotesController');
app.use('/notes', NotesController);

module.exports = app;