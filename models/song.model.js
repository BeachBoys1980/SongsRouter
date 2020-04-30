const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SongSchema = new Schema({
  id: Number,
  name: {
    type: String,
    required: true,
    minlength: 3,
    unique: true,
  },
  artist: {
    type: String,
    required: true,
    minlength: 3,
  },
});

const SongModel = mongoose.model("SongModel", SongSchema);
module.exports = SongModel;
