const express = require('express');
const bodyParser = require('body-parser');
const app = express();

let count = 0;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/counter", (req, res) => {
  return res.status(200).json({ count });
});

app.post("/counter", (req, res) => {
  const { increaseBy } = req.body;
  count += Number(increaseBy);
  return res.status(200).json({ count });
});