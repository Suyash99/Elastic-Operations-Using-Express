const express = require("express");
const app = express.Router();
const {
  putDocumentInIndex,
  createIndex,
} = require("../Controller/elasticOperations");
const logger = require("../logger");

app.param("id", (req, res, next, id) => {
  logger.info("Id Number- " + id);
  next();
});

app.param("indexName", (req, res, next, indexName) => {
  logger.info("Index Name- " + indexName);
  next();
});

app.post("createIndex/:id", async (req, res) => {
  res.end();
});

app.get("createIndex/:indexName", async (req, res) => {
  res.end();
});

module.exports = app;
