const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
  },
  token: {
    type: String,
  },
});

const User = mongoose.model("user", schema);

module.exports = User;
