const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const {
  getAllVerifiedUsers,
  getTargettedUsers
} = require("./_db.js");

/**
  TODO:
    - update getAllVerifiedUsers to only search for users that match post requirements
    - update message to use customer message instead of default message
 */
exports.handler = async (event, context, callback) => {

  let selectedAgeGroups = [];
  let province = "CA";
  let postalCodes = [];
  let eligibilityGroups = [];

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

  let getMessageBody = () => {
    return 'Testing sending bulk messages';
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
  let messageBody = getMessageBody();

  return sendMessages(userBindings, messageBody);

}