const express = require("express");
const app = express();
const usersRouter = require("./routes/usersRouter");
const songsRouter = require("./routes/songsRouter");
const moviesRouter = require("./routes/moviesRouter");

/* Cookies */
const cookieParser = require("cookie-parser");
app.use(cookieParser("thisIsASecret"));

const cors = require("cors");

const corsOptions = {
  credentials: true,
  allowedHeaders: "content-type",
  origin: "http://localhost:3001",
};

app.use(cors(corsOptions));
app.use(cookieParser());
/* end of Cookies */

require("./utils/db");

app.use(express.json());

/* -- JWT user exercise -- */
app.use("/user", usersRouter);

/* -- song exercise -- */
app.use("/song", songsRouter);

/* -- movie exercise -- */
app.use("/movies", moviesRouter);

//error handling
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  console.log(err);
  res.status(err.statusCode).send(err.message);
});

module.exports = app;
