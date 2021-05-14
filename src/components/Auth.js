import React, { useState } from "react";
import { Row, Col, Image } from "react-bootstrap";

import SectionHeader from "./SectionHeader";
import heroImage from "./../images/email-campaign-cuate.svg";
import FormAlert from "./FormAlert";
import AuthForm from "./AuthForm";
import AdminSignupForm from "./AdminSignupForm";
import AuthFooter from "./AuthFooter";
import { useRouter } from "./../util/router.js";

function Auth(props) {
  const router = useRouter();
  const [formAlert, setFormAlert] = useState(null);

  const handleAuth = (user) => {
    router.push(props.afterAuthPath);
  };

  const handleFormAlert = (data) => {
    setFormAlert(data);
  };

  return (
    <>
      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}

      {props.type === "admin" ? (
          <AdminSignupForm />
      ) : (
        <AuthForm
          type={props.type}
          typeValues={props.typeValues}
          onAuth={handleAuth}
          onFormAlert={handleFormAlert}
        />
      )}
      <AuthFooter type={props.type} typeValues={props.typeValues} />
    </>
  );
}

export default Auth;
