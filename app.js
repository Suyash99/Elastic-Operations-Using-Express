const express = require("express");
const app = express();
const { json } = require("body-parser");
const logger = require("./logger");
const { isAuthorized } = require("./Controller/auth");
require("dotenv").config();
process.env.TZ = "Asia/Calcutta";

app.use(json());
app.use(isAuthorized);

const port = process.env.port;

app.listen(port, () => {
  logger.info("Server is up and running");
});

app.get("/", (req, res) => {
  res.json({
    data: "Home Page GET Response",
    error: null,
    status: 200,
  });
});
