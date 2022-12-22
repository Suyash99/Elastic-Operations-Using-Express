const fs = require("fs");
const rp = require("request-promise");
const logger = require("../logger");
require("dotenv").config();
const basePath = process.env.basePath;

async function putDocumentInIndex(file, indexName, cookie) {
  try {
    let splitValue = file.split("\r\n");

    if (!splitValue.length) {
      logger.error("Some error in spliting value please check file");
      return "Please upload file in appropriate format";
    }

    logger.info("Total Indexes- " + splitValue.length);
    var opArray = new Array();
    /**
     * Odd index -- Document
     * Even index -- Document Index number
     */

    for (let i = 0; i < splitValue.length; i += 2) {
      let _id = JSON.parse(unescape(splitValue[i])).index._id;
      let document = JSON.parse(unescape(splitValue[i + 1]));
      var response = await operationOnElastic(indexName, _id, cookie, document);
      if (typeof response == "object") {
        delete response["_version"];
        delete response["_primary_term"];
      } else {
        opArray.push({
          _index: indexName,
          _id: _id,
          result: "failed",
          reason: response,
        });
      }
    }

    return opArray;
  } catch (err) {
    logger.error("Catched Error fnx-putDocumentInIndex " + err.message);

    return (
      "Some error in inserting document in index " +
      indexName +
      "- " +
      err.message
    );
  }
}

async function createIndex(indexName, cookie) {
  try {
    return await operationOnElastic(
      indexName,
      null,
      cookie,
      null,
      "PUT",
      "_doc"
    );
  } catch (error) {
    logger.error("Catched Error fnx-createIndex " + error.message);

    return "Some error creating index " + indexName + "- " + error.message;
  }
}

async function queryInsideIndex() {}

async function seeMappingOfIndex() {}

async function runAnalyzer() {}

async function operationOnElastic(
  indexName,
  _id = null,
  cookie,
  document = null,
  method,
  queryOn
) {
  try {
    var url = basePath + indexName;
    if (_id) {
      url = url + `/${queryOn}/${_id}&method=${method}`;
    } else {
      url = url + `/${queryOn}&method=${method}`;
    }
    var options = {
      uri: url,
      method: "POST",
      json: true,
      headers: {
        cookie: cookie,
        "kbn-xsrf": "reporting",
      },
    };

    if (document) {
      options["body"] = document;
    }
    const response = await rp(options);

    return response;
  } catch (error) {
    logger.error("Catched Error- " + error.message);
    return "Some error in executing API- " + error.message;
  }
}

module.exports = {
  putDocumentInIndex: putDocumentInIndex,
  createIndex: createIndex,
  queryInsideIndex: queryInsideIndex,
  seeMappingOfIndex: seeMappingOfIndex,
  runAnalyzer: runAnalyzer,
};
