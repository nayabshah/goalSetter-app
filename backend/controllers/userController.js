const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

// @desc    add user
// @route   POST /api/users
// @access  public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Pleace add  all fields");
  }
  //   check if user exists
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);
  const user = await User.create({
    name,
    email,
    password: hashedpassword,
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    login user
// @route   POST /api/users/login
// @access  public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  // check for user email
  const user = await User.findOne({ email });
  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid credentials");
  }
});

// @desc    get user data
// @route   GET /api/users/me
// @access  private
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json(req.user);
});

// generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};
