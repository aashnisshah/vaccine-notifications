const _ = require("lodash");
const { sendBulkNotifications } = require('./_expo');

const { getTargettedUsers } = require("./_db.js");

let messageFooter = "Manage notifications at vaccinenotifications.org.";

exports.handler = async (event) => {
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

    let getMobileUserBindings = async (
        cities,
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    ) => {
        let mobileUsers = await getTargettedUsers(
            cities,
            province,
            postalCodes,
            selectedAgeGroups,
            eligibilityGroups,
            "mobile"
        );

        let expoTokens = mobileUsers.map((user) =>
            user.expoToken
        );


        return _.uniq(expoTokens);
    };

    let getDesktopUserBindings = async (
        cities,
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    ) => {
        let desktopUsers = await getTargettedUsers(
            cities,
            province,
            postalCodes,
            selectedAgeGroups,
            eligibilityGroups,
            "desktop"
        );

        console.log("desktop users 1", desktopUsers);

        let desktopSubscriptions = desktopUsers.map((user) =>
            user.webPushSubscription
        );
        

        return _.uniq(desktopSubscriptions);
    }

    let getMessageBody = async(
        city,
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    ) => {
        let messageBody = "";

        if (message) {
            messageBody = message;
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

    let sendMobileMessages = async (expoTokenList, messageBody) => {
        const title = messageType;
        const body = messageBody;
        const messageData = data;
        console.log('raw data', messageData);
        const res = await sendBulkNotifications(expoTokenList, title, body, messageData);
        console.log('sendmessages: ', res);
        return res;
    };

    let sendDesktopMessages = async (desktopList, messageBody) => {
        const title = messageType;
        const body = messageBody;
        const messageData = data;
        desktopList.forEach((subscription) => {
            
        });
    };

    let expoTokenList = await getMobileUserBindings(
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    );

    const desktopList = await getDesktopUserBindings(
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    );
    
    if (expoTokenList.length === 0 && desktopList.length === 0) {
        console.log('No People')
        return {
            statusCode: 400,
            body: `Message sent to 0 users`,
        };
    }
  
    let messageBody = await getMessageBody(
        province,
        postalCodes,
        selectedAgeGroups,
        eligibilityGroups
    );
    console.log(messageBody)
    console.log("This is DesktopList: ", desktopList);
    console.log("This is tokenList:", expoTokenList);
    console.log('about to send bulk messages through')
    // const res = await sendMobileMessages(expoTokenList, messageBody)
    console.log('sendmessage res', res);
    return res;
    // context.succeed(res);
    // return sendMessages(userBindings, messageBody);
};
