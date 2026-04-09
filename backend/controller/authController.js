const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// @desc.   Register new user
// @route.  Post /api/auth/register
// @access. Public
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password });

    if (user) {
      res.status(201).json({
        message: "User created successfully",
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Loginuser
// @route.  Post /api/auth/register
// @access. Public
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (user && (await user.matchPassword(password))) {
      res.status(200).json({
        message: "Login successful",
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Wrong credentials" });
    }
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Get current logged in user
// @route.  Get /api/auth/profile
// @access. Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc.   Update user profile
// @route.  Put /api/auth/me
// @access. Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;

      const updatedUser = await user.save();

      res.json({
        _id: user._id,
        name: updatedUser.name,
      });
    } else {
      red.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("ERROR:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};
