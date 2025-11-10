const validator = require("validator");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateTokens } = require('../utils/user');
const { sendEmail } = require('../utils/sendEmail');

// Register
const Register = async (req, res) => {
  try {
    const { userName, email, password, confirmPassword } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please enter a valid email" });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(password, salt);

    const user = new User({
      userName,
      email,
      password: hashPassword
    });

    const newUser = await user.save();
    const { accessToken, refreshToken } = generateTokens(newUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 
    });

    res.status(201).json({
      success: true,
      user: {
        id: newUser._id,
        userName: newUser.userName,
        email: newUser.email
      },
      accessToken
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

//  Login 
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid Email" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: "Invalid password" });
   
     const { accessToken, refreshToken } = generateTokens(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      message: "Login successfully",
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email
      },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout
const Logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict"
    });

    res.json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const forgetPassword = async(req,res)=>{
  try{
    const {email} =req.body;
    const user = await User.findOne({email});
      if (!user){
return res.status(404).json({ message: 'User not found' });
      } 

      const { accessToken} = generateTokens(user);
      const resetLink = `http://localhost:3000/reset-password/${accessToken}`;
      await sendEmail(email, 'Password Reset', `Click here: ${resetLink}`);

      res.json({ message: 'Password reset link sent to your email' });


  }
catch (err) {
    res.status(500).json({ error: err.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { accessToken } = req.params;
    const { newPassword } = req.body;

    const userr = jwt.verify(accessToken, process.env.JWT_SECRET);
    const user = await User.findById(userr.id);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};


const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password -refreshToken');
  res.json(user);
};



module.exports = { Register, Login, Logout,forgetPassword , resetPassword, getProfile};
