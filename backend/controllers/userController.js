const asyncHandler = require("express-async-handler");
const generateToken = require("../utils/jsonUtils");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400); // bad request
    throw new Error("User already exists");
  }

  const user = await User.create({
    email: email,
    password: password,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (!user) {
    res.status(400);
    throw new Error("No user found");
  }

  const validate = await bcrypt.compare(req.body.password, user.password);
  console.log(validate);
  if (!validate) {
    res.status(401);
    throw new Error("Wrong password");
  }

  const token = jwt.sign(
    {
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
      _id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "12000s",
    }
  );

  const options = {
    maxAge: 60 * 60 * 1000,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

  res.cookie("token", token, options);
  res.status(200).json();
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    message: "Success"
  });
});

module.exports = { registerUser, loginUser, logoutUser };
