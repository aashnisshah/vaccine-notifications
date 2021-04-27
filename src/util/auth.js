import React, {useState, useEffect, useMemo, useContext, createContext,} from "react";
import queryString from "query-string";
import firebase from "./firebase";
import { useUser, createMessage, createUser, updateUser, findUserByPhoneNumber } from "./db";
import { history } from "./router";
import PageLoader from "./../components/PageLoader";
import { sendAccountActivatedMessage } from "./twilio"
import analytics from "./analytics";

// Whether to merge extra user data from database into auth.user
const MERGE_DB_USER = true;
// Whether to send email verification on signup
const EMAIL_VERIFICATION = true;
// Whether to connect analytics session to user.uid
const ANALYTICS_IDENTIFY = true;

const authContext = createContext();

// Context Provider component that wraps your app and makes auth object
// available to any child component that calls the useAuth() hook.
export function AuthProvider({ children }) {
  const auth = useAuthProvider();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook that enables any component to subscribe to auth state
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useAuthProvider() {
  // Store auth user object
  const [user, setUser] = useState(null);

  // Format final user object and merge extra data from database
  const finalUser = usePrepareUser(user);

  // Connect analytics session to user
  useIdentifyUser(finalUser);

  // Handle response from authentication functions
  const handleAuth = async (response, data="") => {
    const { user, additionalUserInfo } = response;

    // Ensure Firebase is actually ready before we continue
    await waitForFirebase();

    // Create the user in the database if they are new
    if (additionalUserInfo.isNewUser) {
      await createUser(user.uid, data);

      // Send email verification if enabled
      if (EMAIL_VERIFICATION) {
        firebase.auth().currentUser.sendEmailVerification();
      }
    } else {
      //check if there is an ExpoToken in local storage and add it to the account
      const expoToken = localStorage.getItem("ExpoToken");
      if (expoToken && !user.expoToken) {
        await updateUser(user.uid, {expoToken: expoToken});
      }
    }

    // Update user in state
    setUser(user);
    return user;
  };


  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: function (response) {
        },
        defaultCountry: "CA",
      }
    );
  };

  const requestOTPCode = async (phoneNumber, isSignIn) => {
    
    try {
      phoneNumber = validatePhoneNumber(phoneNumber);
      if (isSignIn && !await isExistingUser(phoneNumber)) {
        throw Error ("No account exists, please create a new account")
      }
  
      let appVerifier = window.recaptchaVerifier;
      const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
        // SMS sent. Prompt user to type the code from the message, then sign the
        // user in with confirmationResult.confirm(code).
        window.confirmationResult = confirmationResult;
        return true;
    } catch (error) {
      if (error.toString().includes("reCAPTCHA has already been rendered in this element")) {
        return true;
      }
      alert(error);
      return false;
    }
      
  }

  const isExistingUser = async (phoneNumber) => {
    try {
      return await findUserByPhoneNumber(phoneNumber);
    } catch (error) {
      console.log('Error fetching user data:', error);
      return false;
    }
  }

  const validatePhoneNumber = (phoneNumber) => {
    // Multi country support will need to change this +1 to corresponding country code, works for US and Canada
    if (!phoneNumber.startsWith("+1") && phoneNumber.length === 10) { 
      phoneNumber = "+1" + phoneNumber;
    } else if (phoneNumber.startsWith("+1") && phoneNumber.length !== 12) {
      throw Error("Please enter a valid phone number");
    }
    return phoneNumber;
  }

  const submitOTPCode = async (otpCode) => {
    const otpConfirm = window.confirmationResult;
    try {
        const result = await otpConfirm.confirm(otpCode);
        const expoToken = localStorage.getItem("ExpoToken");
        if (expoToken && !result.user.expoToken) {
          await updateUser(result.user.uid, {expoToken: expoToken});
        }
        setUser(result.user);

        return true;
    } catch (err) {
        const error = err.toString();
        if (error.includes("FirebaseError")) {
          alert("Error creating the user");
        } else {
          alert("Incorrect OTP");
        }
        return false;
    }
  }

  const signup = async (data, password) => {
    try {
      const response = await firebase.auth().createUserWithEmailAndPassword(data.email, password)
      const user = await handleAuth(response, data);
      return {status: 200, user}
    } catch (error) {
      alert(error.message);
      return {status: 400, errorMessage: `ERROR: ${error.message}`};
    }
  };

  const signin = async (email, password) => {
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password)
      const user = await handleAuth(response);

      return {status: 200, user}
    } catch (error) {
      alert(error.message);
      
      return {status: 400, errorMessage: `ERROR: ${error.message}`};
    }
  };

  const signinWithProvider = (name) => {
    // Get provider data by name ("password", "google", etc)
    const providerData = allProviders.find((p) => p.name === name);

    const provider = new providerData.providerMethod();

    if (providerData.parameters) {
      provider.setCustomParameters(providerData.parameters);
    }

    return firebase.auth().signInWithPopup(provider).then(handleAuth);
  };

  const signout = () => {
    return firebase.auth().signOut();
  };

  const sendPasswordResetEmail = (email) => {
    return firebase.auth().sendPasswordResetEmail(email);
  };

  const confirmPasswordReset = (password, code) => {
    // Get code from query string object
    const resetCode = code || getFromQueryString("oobCode");

    return firebase.auth().confirmPasswordReset(resetCode, password);
  };

  const updateEmail = (email) => {
    return firebase
      .auth()
      .currentUser.updateEmail(email)
      .then(() => {
        // Update user in state (since onAuthStateChanged doesn't get called)
        setUser(firebase.auth().currentUser);
      });
  };

  const updatePassword = (password) => {
    return firebase.auth().currentUser.updatePassword(password);
  };

  // Update auth user and persist to database (including any custom values in data)
  // Forms can call this function instead of multiple auth/db update functions
  const updateProfile = async (data) => {
    const { email, name, picture } = data;

    // Update auth email
    if (email) {
      await firebase.auth().currentUser.updateEmail(email);
    }

    // Update auth profile fields
    if (name || picture) {
      let fields = {};
      if (name) fields.displayName = name;
      if (picture) fields.photoURL = picture;
      await firebase.auth().currentUser.updateProfile(fields);
    }

    // Persist all data to the database
    await updateUser(user.uid, data);

    // Update user in state
    setUser(firebase.auth().currentUser);
  };

  useEffect(() => {
    // Subscribe to user on mount
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(false);
      }
    });

    // Unsubscribe on cleanup
    return () => unsubscribe();
  }, []);

  const postMessage = async (message) => {
    function randomString(length, chars) {
      let result = '';
      for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    const rString = randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  
    await createMessage(rString, message)
  }

  return {
    user: finalUser,
    setUpRecaptcha,
    signup,
    signin,
    signinWithProvider,
    signout,
    sendPasswordResetEmail,
    confirmPasswordReset,
    requestOTPCode,
    submitOTPCode,
    updateEmail,
    updatePassword,
    updateProfile,
    postMessage
  };
}
  
// Format final user object and merge extra data from database
function usePrepareUser(user) {
  // Fetch extra data from database (if enabled and auth user has been fetched)
  const userDbQuery = useUser(MERGE_DB_USER && user && user.uid);

  // Memoize so we only create a new object if user or userDbQuery changes
  return useMemo(() => {
    // Return if auth user is null (loading) or false (not authenticated)
    if (!user) return user;

    // Data we want to include from auth user object
    let finalUser = {
      uid: user.uid,
      phoneNumber: user.phoneNumber,
      // email: user.email,
      // emailVerified: user.emailVerified,
      name: user.displayName,
      // picture: user.photoURL,
    };

    // Include an array of user's auth providers, such as ["password", "google", etc]
    // Components can read this to prompt user to re-auth with the correct provider
    // finalUser.providers = user.providerData.map(({ providerId }) => {
    //   return allProviders.find((p) => p.id === providerId).name;
    // });

    // If merging user data from database is enabled ...
    if (MERGE_DB_USER) {
      switch (userDbQuery.status) {
        case "idle":
          // Return null user until we have db data to merge
          return null;
        case "loading":
          return null;
        case "error":
          // Log query error to console
          console.error(userDbQuery.error);
          return null;
        case "success":
          // If user data doesn't exist we assume this means user just signed up and the createUser
          // function just hasn't completed. We return null to indicate a loading state.
          if (userDbQuery.data === null) return null;

          // Merge user data from database into finalUser object
          Object.assign(finalUser, userDbQuery.data);

        // no default
      }
    }

    return finalUser;
  }, [user, userDbQuery]);
}

// A Higher Order Component for requiring authentication
export const requireAuth = (Component) => {
  return (props) => {
    // Get authenticated user
    const auth = useAuth();

    useEffect(() => {
      // Redirect if not signed in
      if (auth.user === false) {
        history.replace("/");
      }
    }, [auth]);

    // Show loading indicator
    // We're either loading (user is null) or we're about to redirect (user is false)
    if (!auth.user) {
      return <PageLoader />;
    }

    // Render component now that we have user
    return <Component {...props} />;
  };
};

// Handle Firebase email link for reverting to original email
export const handleRecoverEmail = (code) => {
  let originalEmail;
  return firebase
    .auth()
    .checkActionCode(code)
    .then((info) => {
      originalEmail = info.data.email;
      // Revert to original email by applying action code
      return firebase.auth().applyActionCode(code);
    })
    .then(() => {
      // Send password reset email so user can change their pass if they
      // think someone else has access to their account.
      return firebase.auth().sendPasswordResetEmail(originalEmail);
    })
    .then(() => {
      // Return original email so it can be displayed by calling component
      return originalEmail;
    });
};

// Handle Firebase email link for verifying email
export const handleVerifyEmail = (code) => {
  return firebase.auth().applyActionCode(code);
};

const allProviders = [
  {
    id: "password",
    name: "password",
  },
  {
    id: "google.com",
    name: "google",
    providerMethod: firebase.auth.GoogleAuthProvider,
  },
  {
    id: "facebook.com",
    name: "facebook",
    providerMethod: firebase.auth.FacebookAuthProvider,
    parameters: {
      // Tell fb to show popup size UI instead of full website
      display: "popup",
    },
  },
  {
    id: "twitter.com",
    name: "twitter",
    providerMethod: firebase.auth.TwitterAuthProvider,
  },
  {
    id: "github.com",
    name: "github",
    providerMethod: firebase.auth.GithubAuthProvider,
  },
];

// Connect analytics session to current user.uid
function useIdentifyUser(user) {
  useEffect(() => {
    if (ANALYTICS_IDENTIFY && user) {
      analytics.identify(user.uid);
    }
  }, [user]);
}

// Waits on Firebase user to be initialized before resolving promise
// This is used to ensure auth is ready before any writing to the db can happen
const waitForFirebase = () => {
  return new Promise((resolve) => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        resolve(user); // Resolve promise when we have a user
        unsubscribe(); // Prevent from firing again
      }
    });
  });
};

const getFromQueryString = (key) => {
  return queryString.parse(window.location.search)[key];
};
