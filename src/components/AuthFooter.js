import React from "react";
import { Link } from "./../util/router.js";
import "./Auth.scss";

function AuthFooter(props) {
  return (
    <div className="AuthFooter text-center mt-4">
      {props.type === "signup" && (
        <>
          Have an account already?
          <Link to="/auth/signin">{props.typeValues.linkTextSignin}</Link>
        </>
      )}

      {props.type === "signin" && (
        <>
          Don't have an account? 
          <Link to="/auth/signup">{props.typeValues.linkTextSignup}</Link>
          <Link to="/auth/forgotpass">
            {props.typeValues.linkTextForgotpass}
          </Link>
        </>
      )}
    </div>
  );
}

export default AuthFooter;
