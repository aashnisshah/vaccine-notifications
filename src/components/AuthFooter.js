import React from "react";
import { Link } from "./../util/router.js";
import "./Auth.scss";

function AuthFooter(props) {
  return (
    <div className="AuthFooter d-flex flex-column text-center mt-4">
      {props.type === "signup" && (
        <div className="d-flex justify-content-center bottomText">
          <p>Have an account already?</p>
          <Link to="/auth/signin">{props.typeValues.linkTextSignin}</Link>
        </div>
      )}

      {props.type === "signin" && (
        <>
        <div className="d-flex justify-content-center bottomText">
        <p>Don't have an account?</p>
        <Link to="/auth/signup">{props.typeValues.linkTextSignup}</Link>
          
        </div>
      </>
      )}
    </div>
  );
}

export default AuthFooter;
