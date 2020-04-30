const express = require("express");
const router = express.Router();

const songsController = require("../controllers/songs.controller");

// --- This route path will get all songs ---
router.get("/", songsController.findAllSongs);

// --- This route path will get a specific song with ID ---
router.get("/:id", songsController.findOneSong);

// --- This route path will create a new song ---
router.post("/", songsController.createOneSong);

// --- This route path will replace a specific song with ID ---
router.put("/:id", songsController.updateOneSong);

// --- This route path will delete a specific song with ID ---
router.delete("/:id", songsController.deleteOneSong);

//error handling
router.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  res.status(err.statusCode).send(err.message);
});

module.exports = router;
