const firebaseAdmin = require("./_firebase");

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
  getAllVerifiedUsers
};
