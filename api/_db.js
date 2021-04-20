const firebaseAdmin = require("./_firebase");
const _ = require("lodash");

const firestore = firebaseAdmin.firestore();

// Get user by uid
function getUserByPhoneNumber(phone) {
  return firestore.collection("users").where("phone", "==", phone).get().then(format);
}

function getAllUsers() {
  return firestore.collection("users").get().then(format);
}

function getAllVerifiedUsers() {
  return firestore.collection("users").where("verified", "==", "true").get().then(format);
}

async function getTargettedUsers(province, postalCodes, ageGroups, eligibilityGroups) {
  console.log(`query: province: ${province} postalCodes: ${postalCodes} ageGroups: ${ageGroups} eligibilityGroups: ${eligibilityGroups} `)
  let query = firestore.collection("users").where("optout", "==", false);

  if (province && province != "CA") {
    query = query.where("province", "==", province);
  } else if (postalCodes.length > 0) {
    query = query.where("postalShort", "in", postalCodes);
  }

  let targettedUsers = [];

  let resp = await query.get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      let userData = doc.data();
      let isTarget = true;

      // check if overlapping ageGroups
      if (ageGroups && ageGroups.length > 0 && userData.ageGroups) {
        if (_.intersection(userData.ageGroups, ageGroups).length == 0) {
          isTarget = false;
        }
      }

      // check if overlapping eligibilityGroups
      if (eligibilityGroups && eligibilityGroups.length > 0 && userData.eligibilityGroups) {
        if (_.intersection(userData.eligibilityGroups, eligibilityGroups).length == 0) {
          isTarget = false;
        }
      }

      if (isTarget && userData.phoneNumber) {
        targettedUsers.push(
          {id: userData.uid,
          phoneNumber: userData.phoneNumber
        });
      }
    });
  });

  return targettedUsers;
}



/**** HELPERS ****/

// Format Firestore response (handles a collection or single doc)
function format(response) {
  if (response.docs) {
    return response.docs.map(getDoc);
  } else {
    return getDoc(response);
  }
}

// Get doc data and merge in doc.id
function getDoc(doc) {
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

module.exports = {
  getUserByPhoneNumber,
  getAllUsers,
  getAllVerifiedUsers,
  getTargettedUsers
};
