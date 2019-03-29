const express = require('express');
const router = express.Router();
const userController = require('./user.controller');
const {isAuthMiddleware} = require('../auth');

/**
 * @swagger
 *   /user:
 *      get:
 *          tags:
 *          - "user"
 *          summary: "get all users"
 *          description: ""
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - in: header
 *              required: true
 *              name: authorization
 *          responses:
 *              200:
 *                  description: "successful operation"
 *                  schema:
 *                      $ref: '#definitions/user'
 *              404:
 *                  description: "Not found"
 *              401:
 *                  description: "Unauthorized"
 */
router.get('/', isAuthMiddleware, userController.allUsers);

/**
 * @swagger
 *   /user:
 *      post:
 *          tags:
 *          - "user"
 *          summary: "create new user"
 *          description: ""
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - in: header
 *              required: true
 *              name: authorization
 *            - in: body
 *              name: user
 *              required: true
 *              schema:
 *                  $ref: '#definitions/user'
 *          responses:
 *              200:
 *                  description: "successful operation"
 *                  schema:
 *                      $ref: '#definitions/user'
 *
 *              404:
 *                  description: "Not found"
 *              401:
 *                  description: "Unauthorized"
 *
 */
//isAuthMiddleware
router.post('/', userController.createUser);

//user model
/**
 *@swagger
 *definitions:
 *  user:
 *      type: object
 *      required:
 *          - login
 *          - password
 *      properties:
 *          login:
 *              type: string
 *          password:
 *              type: string
 */


module.exports = router;