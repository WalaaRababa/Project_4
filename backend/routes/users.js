const express = require("express");
const { register, login } = require("../controllers/users");

// define router
const usersRouter = express.Router();

/*
 * Testing Routes:
 * POST -> https://blog-it-n9gi.onrender.com/users/register
 */

/*
 * Testing Object:
{
  "firstName": "John",
  "lastName": "Doe",
  "age": 27,
  "country": "Jordan",
  "email":"John@hotmail.com",
  "password": "123456",
  "role":"61d03786a0848857b2c15026"
}
*/

usersRouter.post("/register", register);
/*
 * Testing Routes:
 * POST -> https://blog-it-n9gi.onrender.com/users/login
 */

/*
 * Testing Object:
{
  "email":"John@hotmail.com",
  "password": "123456"
}
*/
usersRouter.post("/login", login);

module.exports = usersRouter;
