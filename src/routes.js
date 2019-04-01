const express = require('express');
const router = express.Router();

const users = require('./user/index');
const {login} = require('./auth/index');

function routes(app) {
    /**
     *  @swagger
     *  tags:
     *  - name: "auth"
     *    description: "auth user"
     */
    app.use('/auth', login);
    /**
     *  @swagger
     *  tags:
     *  - name: "user"
     *    description: "work with user"
     */
    app.use('/user', users);
}

module.exports = routes;