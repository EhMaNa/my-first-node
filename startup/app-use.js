const express = require('express');
const error = require('../middleware/error-handling')

module.exports = function (app) {
    app.set('view engine', 'ejs');
    app.use('/folder', express.static('folder'));
    app.use(express.urlencoded({ extended: false }));
    app.use('/', require('../routes/route'));
    app.use(error);
}