const client = require("twilio")(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);
const _ = require("lodash");
const { getTargettedUsers } = require("./_db.js");

let messageFooter = "Manage notification settings at vaccinenotifications.org.";

exports.handler = async (event, context, callback) => {
    let data = JSON.parse(event.body);

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

        let bindings = users.map((user) =>
            JSON.stringify({
                binding_type: "sms",
                address: user.phoneNumber,
                identity: user.id,
            })
        );

        return bindings;
    };

    let getMessageBody = (
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    ) => {
        let messageBody = messageType;

        if (message) {
            messageBody = messageBody + "\n\n" + message;
        }

        // start details we know
        messageBody = messageBody + "\n\nDetails We Know: ";

        if (province) {
            let provinceText = province === "CA" ? "All Provinces" : province;
            messageBody = messageBody + "\nProvince: " + provinceText;
        }

        if (postalCodes.length > 0) {
            messageBody =
                messageBody + "\nPostal Codes: " + postalCodes.join(", ");
        }

        if (selectedAgeGroups.length > 0) {
            messageBody =
                messageBody + "\nAge Groups: " + selectedAgeGroups.join(", ");
        }

        if (eligibilityGroups.length > 0) {
            messageBody =
                messageBody + "\nEligibility Groups: " + eligibilityGroups.join(", ");
        }

        // end of details

        if (linkToBooking) {
            messageBody =
                messageBody + "\n\nMore info + register here: " + linkToBooking;
        }

        if (numberToBooking) {
            messageBody =
                messageBody + "\n\nCall to book here: " + numberToBooking;
        }

        if (linkToSrc) {
            messageBody = messageBody + "\n\nSource: " + linkToSrc;
        }

        messageBody = messageBody + "\n\n" + messageFooter;
        return messageBody;
    };

    let sendMessages = async (userBindings, messageBody) => {
        return await client.notify
            .services(process.env.TWILIO_NOTIFY_SID)
            .notifications.create({
                toBinding: userBindings,
                body: messageBody,
            })
            .then((notification) => {
                console.log(notification.sid, "successfully sent");
                return {
                    statusCode: 200,
                    body: `Message sent to ${userBindings.length}`,
                };
            })
            .catch((error) => {
                console.log(error);
                return {
                    statusCode: 500,
                    body: `Error Sending Message: ${JSON.stringify(error)}`,
                };
            });
    };

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
};
