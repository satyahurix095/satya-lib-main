const express = require("express");
const router = express.Router();

const User = require("../models/usersModel");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
//regestering new user
router.post("/register", async (req, res) => {
  try {
    //checking if the user exists
    const user = await user.findOne({ email: req.body.email });
    if (user) {
      return res.send({
        success: false,
        message: "Email alredy exists",
      });
    }
    //hash passwd
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //create a new user
    const newUser = new user(req.body);
    await newUser.save();
    return res.send({
      success: true,
      message: "user created successfully",
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

//login a user
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    //check is passwd is crct
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        success: false,
        message: "invalid password",
      });
    }

    //create and asign a token
    const token = jwt.sign({ _id: user._id }, process.env.jwt_secret, {
      expiresIn: "1d",
    });
    return res.send({
      success: true,
      message: "Login Successful",
      data: token,
    });
  } catch (error) {
    return res.send({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
