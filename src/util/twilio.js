import { apiRequest } from "./util";

export async function sendAccountActivatedMessage(data) {
    // return apiRequest("twilio-new-account-confirmed", "POST", data);
    return {
        statusCode: 200,
        body: "ok",
    };
}

export async function sendTargettedMessages(data) {
    return apiRequest("twilio-send-bulk-message", "POST", data);
}
