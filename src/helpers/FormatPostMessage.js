export const getSendTo = (data) => {
  let selectedAgeGroups = data.selectedAgeGroups ? data.selectedAgeGroups : "";
  let province = data.province ? data.province : "";
  let postalCodes = data.postal ? data.postal : "";
  let cities = data.cities ? data.cities : "";
  let eligibilityGroups = data.eligibilityGroups ? data.eligibilityGroups : "";

  const allGroupTypes = [selectedAgeGroups, province, postalCodes, cities, eligibilityGroups];
  const allGroups = [];

  for (const group of allGroupTypes) {
    if (Array.isArray(group)) {
      for (const each of group) {
        allGroups.push(each);
      }
    } else {
      if (group !== "") {
        allGroups.push(group)
      }
    }
  }

  return allGroups
}

export const getMessageBody = (data) => {
    let messageFooter = "Manage notifications at vaccinenotifications.org.";
   
    let linkToBooking = data.linkToBooking;
    let linkToSrc = data.linkToSrc;
    let message = data.message;
    let messageType = data.messageType;
    let numberToBooking = data.numberToBooking;
    let messageBody = messageType;

    if (message) {
        messageBody = messageBody + "\n\n" + message;
    }

    if (linkToBooking && !numberToBooking) {
      messageBody = messageBody + "\n\nBook here: " + linkToBooking;
    } else if (!linkToBooking && numberToBooking) {
      messageBody = messageBody + "\n\nBook here: " + numberToBooking;
    } else if (linkToBooking && numberToBooking) {
      messageBody = messageBody + "\n\nBook here: " + linkToBooking + ", " + numberToBooking;
    }

    if (linkToSrc) {
        messageBody = messageBody + "\nSource: " + linkToSrc;
    }

    messageBody = messageBody + "\n\n" + messageFooter;

    return messageBody;
};