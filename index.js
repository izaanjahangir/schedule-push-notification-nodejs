const express = require("express");
const app = express();

require("./db");

app.use(express.json());

app.use("/api", require("./route"));

app.listen(5000, () => {
  console.log("Server is running on PORT 5000");
});
