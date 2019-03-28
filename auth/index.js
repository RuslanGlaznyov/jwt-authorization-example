const express = require('express');
const router = express.Router();

const authController = require('./auth.controller');
const isAuthMiddleware = require('./auth.middleware');
/**
 * @swagger
 *   /login:
 *      post:
 *          tags:
 *          - "auth"
 *          summary: "login"
 *          description: ""
 *          produces:
 *          - "application/json"
 *          responses:
 *              200:
 *                  description: "successful operation"
 *                  schema:
 *                      $ref: '#definitions/tokens'
 *              404:
 *                  description: "Not found"
 *              401:
 *                  description: "Unauthorized"
 */
router.post('/login', authController.login);

/**
 * @swagger
 *   /refresh:
 *      post:
 *          tags:
 *          - "auth"
 *          summary: "refresh pair of access and refresh token "
 *          description: ""
 *          produces:
 *          - "application/json"
 *          parameters:
 *            - in: body
 *              name: refreshToken
 *              required: true
 *              schema:
 *                  type: object
 *                  properties:
 *                      refreshToken:
 *                          type: string
 *          responses:
 *              200:
 *                  description: "successful operation"
 *                  schema:
 *                      $ref: '#definitions/tokens'
 *              404:
 *                  description: "Not found"
 */
router.post('/refresh',  authController.refresh);

/**
 * @swagger
 *   /logout:
 *      post:
 *          tags:
 *          - "auth"
 *          summary: "logout user"
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
 *              404:
 *                  description: "Not found"
 *              401:
 *                  description: "Unauthorized"
 */
router.post('/logout',isAuthMiddleware,  authController.logout);

/**
 *@swagger
 *definitions:
 *  tokens:
 *      type: object
 *      required:
 *          - token
 *          - refreshToken
 *      properties:
 *          token:
 *              type: string
 *          refreshToken:
 *              type: string
 */
module.exports = {
    isAuthMiddleware,
    login: router
};
