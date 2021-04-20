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

  let ageGroups = ["18-49"];
  let province = "CA";
  let postalCodes = [];
  let postalShort = [];
  let eligibilityGroups = [];

  let users = await getTargettedUsers(province, postalCodes, ageGroups, eligibilityGroups);
  console.log(`targetted users: ${JSON.stringify(users)}`);

  return {
    statusCode: 200,
    body: JSON.stringify(users, null, 2)
  }

  // let users = await getAllVerifiedUsers();
  // let usersAddresses = [];

  // let userBindings = users.map(user => JSON.stringify({
  //   binding_type: 'sms',
  //   address: `+1${user.phone}`,
  //   identity: user.id,
  // }));

  // await client.notify.services(process.env.TWILIO_NOTIFY_SID)
  // .notifications.create({
  //   toBinding: userBindings,
  //   body: 'Testing sending bulk messages!'
  // })
  // .then(notification => {
  //   console.log(notification.sid, JSON.stringify(notification));
  //   return {
  //     statusCode: 200,
  //     body: `Message {messageId} sent to ${users.length}`,
  //   };
  // })
  // .catch(error => {
  //   console.log(error)
  //   return {
  //     statusCode: 500,
  //     body: `Error Sending Message: ${JSON.stringify(error)}`
  //   }
  // });

}