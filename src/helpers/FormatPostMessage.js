export const getMessageBody = (data) => {
    let messageFooter = "Manage notification settings at vaccinenotifications.org.";
    let selectedAgeGroups = data.selectedAgeGroups;
    let province = data.province;
    let postalCodes = data.postal;
    let eligibilityGroups = data.eligibilityGroups;

    let linkToBooking = data.linkToBooking;
    let linkToSrc = data.linkToSrc;
    let message = data.message;
    let messageType = data.messageType;
    let numberToBooking = data.numberToBooking;
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
            messageBody +
            "\nEligibility Groups: " +
            eligibilityGroups.join(", ");
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