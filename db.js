const mongoose = require("mongoose");
const MONGO_URI = "mongodb://localhost:27017/schedule-notification";

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose
  .connect(MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log("error connecting database =>", err));

module.exports = mongoose;
