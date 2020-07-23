const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
  id: String,
  owner: String,
  isPublic: Boolean,
  description: String,
  latitude: Number,
  longitude: Number,
});

const Location = mongoose.model('Location', locationSchema);
module.exports = Location;