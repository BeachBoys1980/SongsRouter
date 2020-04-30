const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const { getJWTSecret } = require("../config/jwt");
const jwt = require("jsonwebtoken");

// create a new user
router.post("/", async (req, res, next) => {
  try {
    const user = new UserModel(req.body);
    await UserModel.init();
    const newUser = await user.save();
    res.send(newUser);
  } catch (err) {
    next(err);
  }
});

// Protect a route trying to find user by username
const protectRoute = (req, res, next) => {
  //const cookieName = "token";
  //const token = req.signedCookies[cookieName];

  try {
    if (!req.cookies.token) {
      throw new Error("You are not authorized");
    }
    req.user = jwt.verify(req.cookies.token, process.env.JWT_SECRET_KEY);
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};

router.get("/:username", protectRoute, async (req, res, next) => {
  const usernameToFind = req.params.username;

  const user = await UserModel.findOne({ username: usernameToFind });

  try {
    // check if user can be found
    if (!user) {
      const noUserError = new Error("No such user");
      noUserError.statusCode = 404;
      throw noUserError;
    }

    // check if user found is the same as login user
    if (req.user.username != usernameToFind) {
      const userNotAllowedError = new Error("Forbidden");
      userNotAllowedError.statusCode = 403;
      throw userNotAllowedError;
    }
    const { _id, __v, password, ...strippedUser } = user.toObject();
    res.json(strippedUser);
  } catch (error) {
    next(error);
  }
});

// Login and logout function
const createJWTToken = (username) => {
  const today = new Date();
  const exp = new Date(today);

  const secret = getJWTSecret();
  exp.setDate(today.getDate() + 60);

  const payload = { username: username, exp: parseInt(exp.getTime() / 1000) };
  const token = jwt.sign(payload, secret);
  return token;
};

const bcrypt = require("bcryptjs");

router.post("/logout", (req, res) => {
  res.clearCookie("token").send("You are now logged out!");
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    const result = await bcrypt.compare(password, user.password);

    if (!result) {
      throw new Error("Login failed");
    }

    const token = createJWTToken(user.username);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = oneDay * 7;
    const expiryDate = new Date(Date.now() + oneWeek);

    // Can expiry date on cookie be changed? How about JWT token?
    res.cookie("token", token, {
      expires: expiryDate,
      httpOnly: true,
      //signed: true,
    });

    // why can't we have secure: true?

    res.status("200").send("You are now logged in!");
  } catch (err) {
    if (err.message === "Login failed") {
      err.statusCode = 400;
    }
    next(err);
  }
});

module.exports = router;
