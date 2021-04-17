import { apiRequest } from "./util";

async function sendAccountActivatedMessage(data) {
  return apiRequest("twilio-new-account-confirmed", "POST", data);
}

export default sendAccountActivatedMessage;
