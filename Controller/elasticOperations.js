const fs = require("fs");
const rp = require("request-promise");
const logger = require("../logger");
require("dotenv").config();
const basePath = process.env.basePath;

async function putDocumentInIndex(file, indexName, cookie) {
  try {
    //File in text format
    logger.info("Put Document Function Invoked " + indexName);
    let splitValue = file.split("\r\n");

    if (!splitValue.length) {
      logger.error("Some error in spliting value please check file");
      return "Please upload file in appropriate format";
    }

    logger.info("Total Indexes- " + splitValue.length);
    var opObject = {
      successfull: 0,
      failed: {
        count: 0,
        reason: [],
      },
    };
    /**
     * Odd index -- Document
     * Even index -- Document Index number
     */
    var method = "PUT";
    var queryOn = "_doc";
    let count = 1;
    for (let i = 0; i < splitValue.length; i += 2) {
      let _id = count;
      let document = JSON.parse(unescape(splitValue[i + 1]));
      var response = await operationOnElastic(
        indexName,
        _id,
        cookie,
        document,
        method,
        queryOn
      );
      if (typeof response == "object") {
        opObject.successfull += 1;
      } else {
        opObject.failed.count += 1;
        opObject.failed.reason.push({
          _index: indexName,
          _id: _id,
          reason: response,
        });
      }
      count += 1;
    }

    return opObject;
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

async function updateParticularDoc(indexName, _id, document, cookie) {
  try {
    //JSON Body
    let method = "PUT";
    let queryOn = "_doc";
    return await operationOnElastic(
      indexName,
      _id,
      cookie,
      document,
      method,
      queryOn
    );
  } catch (err) {
    logger.error("Catched error fnx:updateParticularDoc- " + err.message);

    return "Some error updating document " + err.message;
  }
}

async function createIndex(
  indexName,
  cookie,
  setting = false,
  isExplicitMapping = false
) {
  try {
    logger.info(
      "Creating Index- " +
        indexName +
        " with external mapping?- " +
        isExplicitMapping
    );

    //TODO: Make me better

    let _id = null;
    let queryOn = "";
    let doc = null;
    if (isExplicitMapping) {
      if (!setting || !Object.keys(setting).length) {
        return "Please provide index external mapping query!";
      }
      doc = {
        mappings: {
          properties: setting,
        },
      };
      return await operationOnElastic(
        indexName,
        _id,
        cookie,
        doc,
        "PUT",
        queryOn
      );
    }
    return await operationOnElastic(
      indexName,
      _id,
      cookie,
      doc,
      "PUT",
      queryOn
    );
  } catch (error) {
    logger.error("Catched Error fnx-createIndex " + error.message);

    return "Some error creating index " + indexName + "- " + error.message;
  }
}

async function deleteIndex(indexName, cookie) {
  try {
    let doc = null;
    let _id = null;
    let method = "DELETE";
    let queryOn = "";
    return await operationOnElastic(
      indexName,
      _id,
      cookie,
      doc,
      method,
      queryOn
    );
  } catch (error) {
    logger.error("Catched error fnx:deleteIndex- " + error.message);
    return `Some error deleting index ${indexName}- ${error.message}`;
  }
}

async function queryInsideIndex(query, indexName, cookie) {
  try {
    //Since searching method used
    logger.info("Search method invoked for index " + indexName);
    let method = "GET";
    let queryOn = "_search";
    let document = query ? query : { query: { match_all: {} } }; //gives all query search result if no query is provided

    let response = await operationOnElastic(
      indexName,
      null,
      cookie,
      document,
      method,
      queryOn
    );

    if (typeof response == "string") {
      return response;
    }

    return response.hits.hits.map((e) => e._source);
  } catch (err) {
    logger.error("Catched error fnx:queryInsideIndex- " + err.message);
    return `Some error quering from index ${indexName}- ${err.message}`;
  }
}

async function seeMappingOfIndex(indexName, cookie) {
  try {
    //Since mapping of index method used
    let method = "GET";
    let queryOn = "_mapping";
    let document = null;

    let response = await operationOnElastic(
      indexName,
      null,
      cookie,
      document,
      method,
      queryOn
    );

    return response[indexName].mappings;
  } catch (error) {
    logger.error("Catched Error fnx:seeMappingOfIndex- " + error.message);
    return "Some error in executing API- " + error.message;
  }
}

async function getAllIndexDetails() {
  //Index Name- index_detail
}

async function refreshIndexDataAPI() {
  try {
    /**
     * Index Name- index_detail
     */
    let indexName = "_cat";
    let _id = null;
    let method = "GET";
    let cookie = process.env.cookie;
    let doc = null;
    let queryOn = "_indices";

    let res = await operationOnElastic(
      indexName,
      _id,
      cookie,
      doc,
      method,
      queryOn
    );

    res = res.split(" ").filter((e) => e); //Filters out empty spaces
    let arr = new Array();
    //Index value is found from 2 index + every 9 ith index
    var documentAtIndex = 2;
    const query = {
      query: {
        match_All: {},
      },
    };
    for (let i = 0; i < res.length; i++) {
      if (index == 2) {
        arr.push(value);
        documentAtIndex += 9;
      } else if (index == documentAtIndex) {
        arr.push(value);
        documentAtIndex += 9;
      }
    }
  } catch (err) {
    logger.error("Catched error fnx:refreshIndexDataAPI- " + err.message);

    return "Some error refreshing data of master index- " + err.message;
  }
}

async function runAnalyzer(setting, cookie) {
  try {
    logger.info("Analyzer invoked");
    let indexName = "_analyze";
    let _id = null;
    let doc = setting;
    let method = "GET";
    let queryOn = "";

    let response = await operationOnElastic(
      indexName,
      _id,
      cookie,
      doc,
      method,
      queryOn
    );

    return typeof response == "string" ? response : response.detail;
  } catch (error) {
    logger.error("Catched error fnx:runAnalyzer- " + error.message);

    return "Some error running analyze API- " + error.message;
  }
}

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
    } else if (queryOn) {
      url = url + `/${queryOn}&method=${method}`;
    } else {
      url = url + `&method=${method}`;
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
  deleteIndex: deleteIndex,
  queryInsideIndex: queryInsideIndex,
  seeMappingOfIndex: seeMappingOfIndex,
  runAnalyzer: runAnalyzer,
  updateParticularDoc: updateParticularDoc,
};
