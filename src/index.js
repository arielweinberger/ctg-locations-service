const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRouter = require('./routers/auth');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

async function initialize() {
  // 1. Connect to the database
  await mongoose.connect('mongodb+srv://admin:<your-password-here>@cluster0.3i1f5.mongodb.net/ctg-internship?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // 2. Serve API
  app.listen(3000, error => {
    if (error) {
      return console.error(error);
    }
  
    console.log("Listetning to new connections on port 3000");
  });
}

initialize();