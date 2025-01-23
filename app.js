const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const logger = require("./logger");
const { HttpStatusCode } = require("axios");
const { isAuthorized } = require("./Controller/auth");
const elasticOperations = require("./View/elasticRoute");
require("dotenv").config();
process.env.TZ = "Asia/Calcutta";

app.use(bodyParser.text());
app.use(bodyParser.json());
app.use(isAuthorized);
app.use("/elastic", elasticOperations);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(HttpStatusCode.InternalServerError).json({
    error: "Something went wrong!",
    message: err.message,
  });
});

const port = process.env.port || 8123;

app.listen(port, () => {
  logger.info("Server is up and running");
});

app.get("/", (req, res) => {
  res.status(HttpStatusCode.Ok).json({
    data: "Home Page GET Response successfull",
    error: null,
    status: HttpStatusCode.Ok,
  });
});
