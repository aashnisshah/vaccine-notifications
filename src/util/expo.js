import { apiRequest } from "./util";

export async function sendAccountActivatedMessage(data) {
    // return apiRequest("twilio-new-account-confirmed", "POST", data);
    return {
        statusCode: 200,
        body: "ok",
    };
}

export async function sendTargettedMessages(data) {
   const res = await apiRequest("expo-push-notification", "POST", data);
   console.log('this is api res', res);
   return {
       statusCode: 200,
       body: "ok",
   }
}
