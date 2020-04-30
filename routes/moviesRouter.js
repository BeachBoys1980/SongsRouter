const express = require("express");
const router = express.Router();
const Joi = require("@hapi/joi");

const movies = [];

const movieSchema = Joi.object({
  movieName: Joi.string()
    //.alphanum() //must contain only alphanumeric characters
    .min(3)
    .max(30) //at least 3 characters long but no more than 30
    .required(),
});

/* -- POST exercise -- */
router.post("/", (req, res, next) => {
  result = movieSchema.validate(req.body);

  // validation error
  if (result.error) {
    console.log("The data is invalid"); //return 400 bad request to client
    const err = new Error(result.error.details[0].message);
    err.statusCode = 400;
    next(err);
  }

  //if no validation error, continue saving data to database
  const newMovie = req.body;
  newMovie.id = movies.length + 1;
  movies.push(newMovie);

  res.status(201).send(newMovie);
});

/* -- GET exercise -- */
router.get("/", (req, res) => {
  res.status(200).send(movies);
});

router.get("/:id", (req, res) => {
  const movie = movies.find((movie) => String(movie.id) === req.params.id);
  res.status(200).send(movie);
});

/* -- error processing -- */
router.use((err, req, res, next) => {
  res.status(err.statusCode || 500);

  res.send(
    `Error: ${err} </br>
    Error Status Code: ${err.statusCode} <br>
    Error stack: ${err.stack}`
  );
});

module.exports = router;
