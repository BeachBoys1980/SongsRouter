const SongModel = require("../models/song.model");

/* -- Get all songs -- */
const findAllSongs = async (req, res) => {
  const result = await SongModel.find();

  res.status(200).json(result);
};

/* -- Get a specific song with ID -- */
const findOneSong = async (req, res) => {
  const result = await SongModel.findOne({ id: req.params.id });

  res.status(200).json(result);
};

/* -- Create a new song -- */
const createOneSong = async (req, res, next) => {
  //get last counter ID and increase counter ID by 1
  const songData = await SongModel.find();
  const nextID = songData.length + 1;

  const name = req.body.name; //take in from body parameter
  const artist = req.body.artist; //take in from body parameter

  const newSong = {
    id: nextID,
    name: name,
    artist: artist,
  };

  //save to MongoDB
  const createOneSong = async (song) => {
    try {
      const newSong = new SongModel(song);
      await SongModel.init(); // make sure indexes are done building
      await newSong.save();
    } catch (err) {
      if (err.name === "ValidationError") {
        err.status = 400;
      }
      next(err);
    }
  };

  await createOneSong({
    id: nextID,
    name: name,
    artist: artist,
  });

  res.status(201).json(newSong);
};

/* -- Update a song with ID -- */
const updateOneSong = async (req, res) => {
  const id = req.params.id; //take in from url parameter
  const name = req.body.name; //take in from body parameter
  const artist = req.body.artist; // take in from body parameter

  const findOneAndUpdate = async (filter, update) => {
    // note that validation is false by default
    const song = await SongModel.findOneAndUpdate(
      filter,
      update,
      // If `new` isn't true, `findOneAndUpdate()` will return the
      // document as it was _before_ it was updated.
      { new: true }
    );
    return song;
  };

  findOneAndUpdate({ id: id }, { name: name, artist: artist }).then((data) => {
    res.status(200).send(data);
  });
};

/* -- Delete a specific song with ID -- */
const deleteOneSong = async (req, res) => {
  const id = req.params.id;

  const deletedSong = await SongModel.findOneAndDelete({ id: id });

  res.status(200).json(deletedSong);
};

module.exports = {
  findAllSongs,
  findOneSong,
  createOneSong,
  updateOneSong,
  deleteOneSong,
};
