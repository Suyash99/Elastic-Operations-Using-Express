const fs = require("fs");
const axios = require("axios");
const rp = require("request-promise");
main();
async function main() {
  let fileContent = fs.readFileSync("./Orders.txt");
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

async function documentPUT(document, index) {
  const response = await rp({
    uri: `http://localhost:5601/api/console/proxy?path=/order/_doc/${index}&method=PUT`,
    method: "POST",
    json: true,
    body: document,
    headers: {
      cookie:
        "sid=Fe26.2**bddd8986fa07a53f51ed23686ce6f9433f1aeba2d98e115e2fd502b6b8e41971*jVwh8I8JC8a6_wqD2qQyYg*1JvoUNu32cI39dltbmcq-E14VWZkj8PjHJ1jufRU5rWV2kjyr9nnPdHx_4XB7rE0BR-FWblTKQinwbCOCjzwK5fJnydZzILgwGxDIod-5RJaHW0mS6kXKcsA11S4zvKUAh3pxOj6NjI7n_GGdw8xmTPu0VSJWIxXiWqMh7VYm56IRbRYtggIvYlwx9CoG2j3TZ899UdswzmgTA5GFtlPVqHJIu6PUA73edfLK6WtLgvm-SGfEVH7cQfXaewPtEpd**70ea2246d09a8aa224d8010961fb2b5a1f3b43db79714730cd3233c19c5bc940*uv6BWuBI88mnbwtonnyU1-swn6UUhX3XOcDjotqcMGY",
      "kbn-xsrf": "reporting",
    },
  });

  return response;
}
