const express = require ('express');
const uuid = require('uuid').v4;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Attempt to sign up as "${username}"`);

  // Check if username already exists.
  // If it exists, send a 409 (Conflict) status code.
  // return, do not continue.
  const exists = await User.findOne({ username });

  if (exists) {
    return res.status(409).json({
      message: "Username already taken"
    });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User();
  user.id = uuid();
  user.username = username;
  user.password = hashedPassword;
  await user.save();

  console.log(`User "${username}" signed up successfully`);
  return res.status(201).send();
});

authRouter.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  console.log(`Attempt to sign in as "${username}"`);

  const user = await User.findOne({ username });

  if (!user) {
    return res.status(401).send();
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send();
  }

  console.log(`Successful sign in as "${username}"`);
  res.cookie('userId', user.id, { httpOnly: true });
  return res.status(200).send();
});

authRouter.post('/signout', async (req, res) => {
  res.clearCookie('userId'); 
  return res.status(200).send();
});

module.exports = authRouter;