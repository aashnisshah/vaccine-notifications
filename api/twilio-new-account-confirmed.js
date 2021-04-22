const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

exports.handler = async (event, context, callback) => {
  const body = JSON.parse(event.body);
  let receiver = `${body.receiver}`;
  let success = true;

  return client.messages
  .create({
     body: `Your account is setup. You will receive vaccine notifications and updates for your region here. \n\nYou can manage your account and preferences, and stop receiving messages at ${process.env.VACCINE_NOTIFICATION_URL}.`,
     from: process.env.TWILIO_PHONE_NUMBER,
     to: receiver
   })
  .then(message => {
    return {
      statusCode: 200,
      body: "Message Sent",
    };
  })
  .catch(error => {
    return {
      statusCode: 500,
      body: "Error Sending Message"
    }
  });

}