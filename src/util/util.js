import firebase from "./firebase";
import axios from 'axios';

export async function apiRequest(path, method = "GET", data) {
  const accessToken = firebase.auth().currentUser
    ? await firebase.auth().currentUser.getIdToken()
    : undefined;
  const requestHeaders = { headers: { Authorization: `Bearer ${accessToken}` }};
  let response;

  if (method == "GET") {
    response = await axios.get(`/api/${path}`, requestHeaders).then(res => {
      console.log(res)
      return res;
    }).catch(error => {
      console.log("error: ", error);
      return error;
    })

  } else if (method == "POST") {
    response = await axios.post(`/api/${path}`, data, requestHeaders).then(res => {
      console.log(res)
      return res;
    }).catch(error => {
      console.log("error: ", error.response.data);
      return {status: 400, data: error.response.data};
    })
  }

  return response;
}

// Create an Error with custom message and code
export function CustomError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}
