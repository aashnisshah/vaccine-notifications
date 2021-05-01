const _ = require("lodash");
const expo = require('./_expo');

const { getTargettedMobileUsers } = require("./_db.js");

let messageFooter = "Manage notifications at vaccinenotifications.org.";

exports.handler = async (event, context, callback) => {
    let data = JSON.parse(event.body);

    let selectedAgeGroups = data.selectedAgeGroups;
    let province = data.province;
    let postalCodes = data.postal;
    let cities = data.cities;
    let eligibilityGroups = data.eligibilityGroups;

    let linkToBooking = data.linkToBooking;
    let linkToSrc = data.linkToSrc;
    let message = data.message;
    let messageType = data.messageType;
    let numberToBooking = data.numberToBooking;

    let getUserBindings = async (
        cities,
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    ) => {
        let users = await getTargettedMobileUsers(
            cities,
            province,
            postalCodes,
            selectedAgeGroups,
            eligibilityGroups
        );

        let expoTokens = users.map((user) =>
            user.expoToken
        );


        return _.uniq(expoTokens);
    };

    let getMessageBody = (
        city,
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
        // messageBody = messageBody 
        // + "\n\nDetails We Know: ";

        // if (province) {
        //     let provinceText = province === "CA" ? "All Provinces" : province;
        //     messageBody = messageBody + "\nProvince: " + provinceText;
        // }

        // if (postalCodes.length > 0) {
        //     messageBody =
        //         messageBody + "\nPostal Codes: " + postalCodes.join(", ");
        // }

        // if (selectedAgeGroups.length > 0) {
        //     messageBody =
        //         messageBody + "\nAge Groups: " + selectedAgeGroups.join(", ");
        // }

        // if (eligibilityGroups.length > 0) {
        //     messageBody =
        //         messageBody +
        //         "\nEligibility Groups: " +
        //         eligibilityGroups.join(", ");
        // }

        // end of details

        if (linkToBooking && !numberToBooking) {
          messageBody = messageBody + "\n\nBook here: " + linkToBooking;
        } else if (!linkToBooking && numberToBooking) {
          messageBody = messageBody + "\n\nBook here: " + numberToBooking;
        } else if (linkToBooking && numberToBooking) {
          messageBody = messageBody + "\n\nBook here: " + linkToBooking + ", " + numberToBooking;
        }

        // if (numberToBooking) {
        //     messageBody =
        //         messageBody + "\n\nCall to book here: " + numberToBooking;
        // }

        if (linkToSrc) {
            messageBody = messageBody + "\n\nSource: " + linkToSrc;
        }

        messageBody = messageBody + "\n\n" + messageFooter;
        return messageBody;
    };

    let sendMessages = async (expoTokenList, messageData) => {
        const title = messageType;
        const body = message;
        const data = {message: messageData}
        return await expo.sendBulkNotifications(expoTokenList,title,body, data)
    };

    let expoTokenList = await getUserBindings(
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    );
    

    if (expoTokenList.length === 0) {
        return {
            statusCode: 200,
            body: `Message sent to 0 people`,
        };
    }

    let messageBody = getMessageBody(
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    );
    console.log(messageBody)
    console.log(expoTokenList);
    
    const res = await sendMessages(expoTokenList, messageBody)
    console.log('sendmessage res', res);
    return {
        statusCode:200, body:'good'
    }
    // return sendMessages(userBindings, messageBody);
};
