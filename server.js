const express = require("express");
const app = express();
const port = 3800;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

require("./routes/museum.routes")(app)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
