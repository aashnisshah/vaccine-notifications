import React from "react";
import Alert from "react-bootstrap/Alert";

function FormAlert(props) {
  const { type, message, ...otherProps } = props;

  return (
    <Alert variant={type === "error" ? "danger" : type} {...otherProps}>
      {message}
    </Alert>
  );
}

export default FormAlert;
