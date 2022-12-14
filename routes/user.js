var express = require("express");
var router = express.Router();

const { isSignedIn, isAuthenticated } = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
} = require("../controllers/user");

//middleware t0 get user details by user ID
router.param("userId", getUserById);

//get user details
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);

//update user details
router.put("/user/:userId", isSignedIn, isAuthenticated, updateUser);

// router.get("/users", getUsers);

module.exports = router;
