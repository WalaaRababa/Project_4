const express = require("express");

// Import roles controller
const { createNewRole } = require("../controllers/roles");

// Create roles router
const rolesRouter = express.Router();

/*
 * Testing Routes:
 * POST -> https://blog-it-n9gi.onrender.com/roles/
*/

/*
 * Testing Object:
{
  "role": "USER",
  "permissions": ["CREATE_COMMENTS"]
}
{
  "role": "ADMIN",
  "permissions": ["CREATE_USERS"]
}
*/

rolesRouter.post("/", createNewRole);

module.exports = rolesRouter;
