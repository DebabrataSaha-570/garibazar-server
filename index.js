const express = require("express");
const cors = require("cors");

const port = process.env.PORT || 5000;
const app = express();

//middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to graribazar server");
});

app.listen(port, () => {
  console.log("Garibazar app is listening on port", port);
});
