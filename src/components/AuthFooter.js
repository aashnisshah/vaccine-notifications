import React from "react";
import { Link } from "./../util/router.js";
import "./Auth.scss";

function AuthFooter(props) {
  return (
    <div className="AuthFooter d-flex flex-column text-center mt-4">
      {props.type === "signup" && (
        <>
          Have an account already?
          <Link to="/auth/signin">{props.typeValues.linkTextSignin}</Link>
        </>
      )}

      {props.type === "signin" && (
        <>
        <Link to="/resetpass">
            Forgot Password ?
          </Link>
        
        <div className="d-flex justify-content-center">
        Don't have an account?
        <Link to="/auth/signup">{props.typeValues.linkTextSignup}</Link>
          
        </div>
      </>
      )}
    </div>
  );
}

export default AuthFooter;
