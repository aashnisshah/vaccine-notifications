import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormAlert from "./FormAlert";
import FormField from "./FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";

function UserPreferences(props) {
  const auth = useAuth();
  const [pending, setPending] = useState(false);

  const { register, handleSubmit, errors } = useForm();
  const [formAlert, setFormAlert] = useState(null);


  // State to control whether we show a re-authentication flow
  // Required by some security sensitive actions, such as changing password.
  const [reauthState, setReauthState] = useState({
    show: false,
  });

  // Handle status of type "success", "error", or "requires-recent-login"
  // We don't treat "requires-recent-login" as an error as we handle it
  // gracefully by taking the user through a re-authentication flow.
  const onStatus = ({ type, message, callback }) => {
    if (type === "requires-recent-login") {
      // First clear any existing message
      setFormAlert(null);
      // Then update state to show re-authentication modal
      setReauthState({
        show: true,
        // Failed action to try again after reauth
        callback: callback,
      });
    } else {
      // Display message to user (type is success or error)
      setFormAlert({
        type: type,
        message: message,
      });
    }
  };

  const onSubmit = (data) => {
    // Show pending indicator
    setPending(true);
    let passVerificationChecks = true;

    // verify phone number is Canadian
    let phoneNumberRegex = /^((([0-9]{1})*[- .(]*([0-9]{3})[- .)]*[0-9]{3}[- .]*[0-9]{4})+)*$/

    // verify postal code
    let postalCodeRegex = /^([ABCEGHJKLMNPRSTVXY][0-9][A-Z] [0-9][A-Z][0-9])*$/;

    passVerificationChecks = phoneNumberRegex.test(data.phone) && postalCodeRegex.test(data.postalcode.toUpperCase());

    if (!passVerificationChecks) {
      onStatus({
        type: "error",
        message: "Phone Number or Postal Code is not valid",
      });
      setPending(false);
      return;
    }

    return auth
      .updateProfile(data)
      .then(() => {
        // Set success status
        onStatus({
          type: "success",
          message: "Your profile has been updated",
        });
      })
      .catch((error) => {
        if (error.code === "auth/requires-recent-login") {
          onStatus({
            type: "requires-recent-login",
            // Resubmit after reauth flow
            callback: () => onSubmit(data),
          });
        } else {
          // Set error status
          onStatus({
            type: "error",
            message: error.message,
          });
        }
      })
      .finally(() => {
        // Hide pending indicator
        setPending(false);
      });
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>

      {formAlert && (
        <FormAlert type={formAlert.type} message={formAlert.message} />
      )}
    
      <Form.Group controlId="formName">
        <FormField
          name="name"
          type="text"
          label="Name"
          defaultValue={auth.user.name}
          placeholder="Name"
          error={errors.name}
          size="lg"
          inputRef={register({
            required: "Please enter your name",
          })}
        />
      </Form.Group>
      <Form.Group controlId="formPhone">
        <FormField
          name="phone"
          type="text"
          label="Phone Number (i.e. 4161231234)"
          defaultValue={auth.user.phone}
          placeholder="4161231234"
          error={errors.phone}
          size="lg"
          inputRef={register({
            required: "Please enter your phone number as '4161231234' format",
          })}
        />
      </Form.Group>
      <Form.Group controlId="formPostalCode">
        <FormField
          name="postalcode"
          type="text"
          label="Postal Code (i.e. A1A 1A1)"
          defaultValue={auth.user.postalcode}
          placeholder="A1A 1A1"
          error={errors.postalcode}
          size="lg"
          inputRef={register({
            required: "Please enter your Postal Code in 'A1A 1A1' format",
          })}
        />
      </Form.Group>
      <Form.Group controlId="formProvince">
        <FormField
          name="province"
          type="select"
          options={[
            "AB",
            "BC",
            "MB",
            "NB",
            "NL",
            "NT",
            "NS",
            "NU",
            "ON",
            "PE",
            "QC",
            "SK",
            "YT",
          ]}
          label="Province"
          defaultValue={auth.user.province}
          placeholder="Province"
          error={errors.province}
          size="lg"
          inputRef={register({
            required: "Please enter your Province",
          })}
        />
      </Form.Group>
      <Button type="submit" size="lg" disabled={pending}>
        <span>Save</span>

        {pending && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden={true}
            className="ml-2 align-baseline"
          >
            <span className="sr-only">Sending...</span>
          </Spinner>
        )}
      </Button>
    </Form>
  );
}

export default UserPreferences;
