const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const _ = require("lodash");
const {
  getAllVerifiedUsers,
  getTargettedUsers
} = require("./_db.js");

let messageFooter = "Manage notification settings at vaccinenotifications.org.";

/**
  TODO:
    - update getAllVerifiedUsers to only search for users that match post requirements
    - update message to use customer message instead of default message
 */
exports.handler = async (event, context, callback) => {

  // console.log(`event: ${JSON.stringify(event)}`)
  let data = JSON.parse(event.body);
  console.log(`data: ${JSON.stringify(data, null, 2)}`)

  // these variables are temp - we should be getting them 
  //  anytime a new post is created
  let selectedAgeGroups = data.selectedAgeGroups;
  let province = data.province;
  let postalCodes = data.postal;
  let eligibilityGroups = data.eligibilityGroups;
  
  let linkToBooking = data.linkToBooking;
  let linkToSrc = data.linkToSrc;
  let message = data.message;
  let messageType = data.messageType;
  let numberToBooking = data.numberToBooking;

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

    // start details we know

    messageBody = messageBody + "\n\nDetails We Know: ";

    if (province) {
      messageBody = messageBody + "\nProvince: " + province;
    }

    if (postalCodes.length > 0) {n
      messageBody = messageBody + "\nPostal Codes: " + postalCodes.join(", ");
    }

    if (selectedAgeGroups.length > 0) {
      messageBody = messageBody + "\nAge Groups: " + selectedAgeGroups.join(", ");
    }

    if (eligibilityGroups.length > 0) {
      messageBody = messageBody + "\nEligibility Groups: " + postalCodes.join(", ");
    }

    // end of details

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