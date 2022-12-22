const fs = require("fs");
const rp = require("request-promise");

async function putDocumentInIndex(cookie) {
  let fileContent = fs.readFileSync("./orders-bulk.txt");
  fileContent = fileContent.toString();
  let splitValue = fileContent.split("\r\n");

  console.log("Total Indexes- " + splitValue.length);
  /**
   * Even index -- Document Index number
   * Odd index -- Document
   */

  try {
    for (let i = 0; i < splitValue.length; i += 2) {
      let index = JSON.parse(unescape(splitValue[i])).index._id;
      let document = JSON.parse(unescape(splitValue[i + 1]));
      const response = await documentPUT(document, index);
      console.log(response);
    }
  } catch (err) {
    console.log(err.message);
  }
}

async function createIndex(cookie) {}

async function documentPUT(document, index, cookie) {
  const response = await rp({
    uri: `http://localhost:5601/api/console/proxy?path=/order/_doc/${index}&method=PUT`,
    method: "POST",
    json: true,
    body: document,
    headers: {
      cookie: cookie,
      "kbn-xsrf": "reporting",
    },
  });

  return response;
}

module.exports = {
  putDocumentInIndex: putDocumentInIndex,
  createIndex: createIndex,
};
