const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true, // helps us to find by username, note that this has a significant production impact
    unique: true,
    minlength: 3,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  firstName: String,
  lastName: String,
  salutation: {
    type: String,
    enum: ["Dr", "Mr", "Mrs", "Ms", "Miss", "Mdm"],
  },
});

userSchema.virtual("fullName").get(function () {
  return `${this.salutation} ${this.firstName} ${this.lastName}`;
});

userSchema.virtual("reverseName").get(function () {
  return `${this.lastName}, ${this.firstName}`;
});

userSchema.pre("save", async function (next) {
  const rounds = 10;
  this.password = await bcrypt.hash(this.password, rounds);
  next();
});

const UserModel = mongoose.model("User", userSchema);

module.exports = UserModel;
