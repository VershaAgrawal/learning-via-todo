const axios = require("axios");

const postToSlack = async (input) => {
  const { taskText, slackUrl } = input;
  const payload = { text: "New Todo created: " + taskText };
  const status = await axios.post(slackUrl, payload);
};

module.exports = postToSlack;
