require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const authMiddleware = require('./middleware/authMiddleware');
const authRouter = require('./routers/auth');
const locationsRouter = require('./routers/locations');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3001' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.use('/locations', authMiddleware);
app.use('/locations', locationsRouter);

async function initialize() {
  // 1. Connect to the database
  await mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.3i1f5.mongodb.net/ctg-internship?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  // 2. Serve API
  app.listen(3000, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log('Listetning to new connections on port 3000');
  });
}

initialize();
