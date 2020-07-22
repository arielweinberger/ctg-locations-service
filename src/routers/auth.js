const express = require ('express');
const uuid = require('uuid').v4;
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

  const user = new User();
  user.id = uuid();
  user.username = username;
  user.password = password;
  await user.save();

  console.log(`User "${username}" signed up successfully`);
  return res.status(200).send();
});

module.exports = authRouter;