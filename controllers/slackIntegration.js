const axios = require("axios");
const slackUrl =
  "https://hooks.slack.com/services/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";

const postToSlack = async (text) => {
  const payload = { text: "New Todo created: " + text };
  const status = await axios.post(slackUrl, payload);
};

module.exports = postToSlack;
