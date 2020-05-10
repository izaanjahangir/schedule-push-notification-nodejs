const express = require("express");
const app = express();

const schedule = require("./services/schedule");

require("./db");

app.use(express.json());

app.use("/api", require("./route"));

schedule.reSchedule();

app.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});
