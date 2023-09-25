const axios = require("axios");

export async function postToSlack(input: {
  taskText: String;
  slackUrl: String;
}): Promise<void> {
  const { taskText, slackUrl } = input;
  const payload = { text: "New Todo created: " + taskText };
  const status = await axios.post(slackUrl, payload);
}
