const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const _ = require("lodash");
const {
  getAllVerifiedUsers,
  getTargettedUsers
} = require("./_db.js");

let messageFooter = "Manage your account at vaccinenotifications.org to stop receiving notifications";

/**
  TODO:
    - update getAllVerifiedUsers to only search for users that match post requirements
    - update message to use customer message instead of default message
 */
exports.handler = async (event, context, callback) => {

  // these variables are temp - we should be getting them 
  //  anytime a new post is created
  let selectedAgeGroups = ["18-49"];
  let province = "";
  let postalCodes = ["M5B", "L9E"];
  let eligibilityGroups = [];
  
  let linkToBooking = "https://elixirlabs.org";
  let linkToSrc = "https://twitter.com/aashnisshah";
  let message = "You can book vaccines for 18+ in Ontario";
  let messageType = "*Vaccine Appointments Available*";
  let numberToBooking = "";

  let getUserBindings = async (
    province,
    postalCodes,
    selectedAgeGroups,
    eligibilityGroups
  ) => {

    let users = await getTargettedUsers(
      province,
      postalCodes,
      selectedAgeGroups,
      eligibilityGroups
    );

    let bindings = users.map(user => JSON.stringify({
      binding_type: 'sms',
      address: user.phoneNumber,
      identity: user.id,
    }));

    return bindings;
  }

  let getMessageBody = (province, postalCodes, selectedAgeGroups, eligibilityGroups) => {
    let groups = _.concat([province], postalCodes, selectedAgeGroups, eligibilityGroups);
    let messageBody;

    if (messageType) {
      messageBody = messageBody + "\n\n" + messageType;
    }

    if (message) {
      messageBody = messageBody + "\n\n" + message;
    }

    messageBody = messageBody + "\n\nDetails We Know: " + 
      "\nProvince: " + province + 
      "\nPostalCodes: " + postalCodes.join(", ") + 
      "\nSelected Age Groups: " + selectedAgeGroups.join(", ") + 
      "\nEligibility Groups: " + eligibilityGroups.join(", ");

    if (linkToBooking) {
      messageBody = messageBody + "\n\nMore info + register here: " + linkToBooking;
    }

    if (numberToBooking) {
      messageBody = messageBody + "\n\nCall to book here: " + numberToBooking;
    }

    if (linkToSrc) {
      messageBody = messageBody + "\n\nSource: " + linkToSrc;
    }

    messageBody = messageBody + "\n\n" + messageFooter;
    return messageBody;
  }

  let sendMessages = async (userBindings, messageBody) => {
    return await client.notify.services(process.env.TWILIO_NOTIFY_SID)
    .notifications.create({
      toBinding: userBindings,
      body: messageBody
    })
    .then(notification => {
      console.log(notification.sid, 'successfully sent');
      return {
        statusCode: 200,
        body: `Message sent to ${userBindings.length}`,
      };
    })
    .catch(error => {
      console.log(error)
      return {
        statusCode: 500,
        body: `Error Sending Message: ${JSON.stringify(error)}`
      }
    });
  }

  let userBindings = await getUserBindings(
    province,
    postalCodes,
    selectedAgeGroups,
    eligibilityGroups
  );
  let messageBody = getMessageBody(
    province,
    postalCodes,
    selectedAgeGroups,
    eligibilityGroups
  );

  return sendMessages(userBindings, messageBody);

}