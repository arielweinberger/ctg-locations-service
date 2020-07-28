require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('1');

const authMiddleware = require('./middleware/authMiddleware');
const authRouter = require('./routers/auth');
const locationsRouter = require('./routers/locations');

console.log('2');


const app = express();

app.use(cors({ credentials: true, origin: 'https://still-scrubland-63924.herokuapp.com' }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRouter);

app.use('/locations', authMiddleware);
app.use('/locations', locationsRouter);

console.log('3');


async function initialize() {
  // 1. Connect to the database
console.log('mdb1');

  await mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.3i1f5.mongodb.net/ctg-internship?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log('mdb2');

  // 2. Serve API
  const port = process.env.PORT || 3000;
  app.listen(port, (error) => {
    if (error) {
      return console.error(error);
    }

    console.log(`Listetning to new connections on port ${port}`);
  });
}

initialize();
