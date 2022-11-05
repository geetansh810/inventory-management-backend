const User = require("../models/user");

const { check, validationResult } = require("express-validator");

var jwt = require("jsonwebtoken");
var {expressjwt} = require("express-jwt");

exports.signup = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        err: "Not able to save user in DB",
        error: err,
      });
    }

    res.json({
      name: user.firstName,
      name: user.lastName,
      email: user.email,
      id: user._id,
    });
  });
};

exports.signin = (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  User.findOne({ email }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User email dosn't exists",
      });
    }

    if (!user.authenticate(password)) {
      return res.status(401).json({
        error: "Email and password dosn't match",
      });
    }

    const token = jwt.sign({ _id: user._id }, "shhhhh");

    res.cookie("token", token, {
      expire: new Date(new Date()).getDate() + 9999,
    });

    const { _id, name, email, firstName, lastName} = user;

    return res.json({
      token,
      user: { _id, name, email, firstName, lastName }
    });
  });
};

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signed-out succesfully",
  });
};

exports.isSignedIn = expressjwt({
  secret: "shhhhh",
  userProperty: "auth",
  algorithms: ["HS256"]
});

exports.isAuthenticated = (req, res, next) => {
  const checker = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!checker) {
    return res.status(403).json({
      error: "ACCESS DENIED",
    });
  }
  next();
};