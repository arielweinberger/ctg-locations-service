const express = require ('express');
const Location = require('../models/Location');
const uuid = require('uuid').v4;

const locationsRouter = express.Router();

locationsRouter.post('/', async (req, res) => {
  const { latitude, longitude, description, isPublic } = req.body;
  const { userId } = req;

  const location = new Location({
    id: uuid(),
    owner: userId,
    latitude,
    longitude,
    description,
    isPublic,
  });

  await location.save();
  return res.status(200).json(location);
});

locationsRouter.get('/', async (req, res) => {
  const { userId } = req;
  const showPublic = req.query.public === 'true';

  let locations;

  if (!showPublic) { // User's locations only
    locations = await Location.find({ owner: userId })
  } else { // User's locations + any public location
    locations = await Location.find().or([
      { owner: userId },
      { isPublic: true }
    ]);
  }

  // Add "canDelete" property to help front-end understand
  // whether the user is permitted to delete a task or not.
  // This does not expose the userId to the user.
  locations = locations.map(location => ({
    ...location._doc,
    canDelete: location._doc.owner === userId,
  }));

  return res.status(200).json(locations);
});

locationsRouter.delete('/:locationId', async (req, res) => {
  const { locationId } = req.params;
  const { userId } = req;

  const location = await Location.findOne({ id: locationId });

  if (!location) {
    return res.status(404).send();
  }

  if (location.owner !== userId) {
    return res.status(403).json({ message: 'You can only delete your own locations' });
  }

  await Location.deleteOne({ id: locationId });
  return res.status(200).send();
});

module.exports = locationsRouter;