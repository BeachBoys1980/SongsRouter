const express = require("express");
const router = express.Router();

let songData = require("../songData");

router.get("/", (req, res) => {
  const results = songData.filter((song) => {
    for (key in req.query) {
      console.log(key);
      if (song[key] && String(song[key]) !== req.query[key]) {
        return false;
      }
    }
    return true;
  });

  res.json(results);
});

// --- This route path will get a specific song with ID ---
router.get("/:id", (req, res) => {
  const song = songData.filter((aSong) => {
    return req.params.id === String(aSong.id);
  })[0]; //also filter away 1st element (i.e. songID) to not return an array

  res.json(song);
});

// --- This route path will create a new song ---
router.post("/", (req, res) => {
  //get last counter ID and increase counter ID by 1
  const nextID = songData.length + 1;

  const name = req.body.name; //take in from body parameter
  const artist = req.body.artist; //take in from body parameter

  //set 'song' variable with new values
  const newSong = {
    id: nextID,
    name: name,
    artist: artist,
  };

  //push to 'songData' array and return
  songData.push(newSong);
  res.status(201).json(newSong);
});

// --- This route path will replace a specific song with ID ---
router.put("/:id", (req, res) => {
  const id = req.params.id; //take in from url parameter
  const name = req.body.name; //take in from body parameter
  const artist = req.body.artist; // take in from body parameter

  let updatedSong = {};

  //loop through 'songData' array and check if 'songData' item = parameter ID, then replace parameter data
  const updatedSongData = songData.map((result) => {
    if (String(result.id) === id) {
      result.name = name;
      result.artist = artist;

      updatedSong = {
        id: parseInt(id),
        name: name,
        artist: artist,
      };
    }
    return result;
  });

  songData = [...updatedSongData];
  res.status(200).send(updatedSong);
});

// --- This route path will delete a specific song with ID ---
router.delete("/:id", (req, res) => {
  const id = req.params.id;

  const deletedSong = songData.filter((aSong) => String(aSong.id) === id)[0];
  const remainingSongs = songData.filter((aSong) => String(aSong.id) !== id);

  songData = [...remainingSongs];
  res.status(200).json(deletedSong);
});

module.exports = router;
