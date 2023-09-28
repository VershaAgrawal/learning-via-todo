import axios from "axios";

export async function postToSlack(input: {
  taskText: String;
  slackUrl: string;
}): Promise<void> {
  const { taskText, slackUrl } = input;
  const payload = { text: "New Todo created: " + taskText };
  const status = await axios.post(slackUrl, payload);
}
