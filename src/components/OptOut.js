import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import FormAlert from "./FormAlert";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import analytics from "./../util/analytics.js";
import { updateUser } from "./../util/db";
import { useAuth } from './../util/auth.js';

function OptOut(props) {
  const [pending, setPending] = useState(false);
  const [formAlert, setFormAlert] = useState(null);

  const auth = useAuth();

  const RECEIVED_DOSE_OPT_OUT_REASON = "received_dose";
  const OTHER_OPT_OUT_REASON = "other";
  const OPT_OUT_REASONS = [
    RECEIVED_DOSE_OPT_OUT_REASON,
    OTHER_OPT_OUT_REASON
  ];

  const processOptOut = async (event) => {
    event.preventDefault();
    setFormAlert(null);

    // Show pending indicator
    setPending(true);

    let optOutReason = event.target[0].value;
    if (!OPT_OUT_REASONS.includes(optOutReason)) {
      setFormErrorMessage("Please select a reason for opting out");
      setPending(false);
      return;
    }

    if (auth.user.optout) {
      setOptOutSuccessMessage("You have already opted out of notifications.")
      setPending(false);
      return;
    }

    optOutUser()
      .then(() => {
        trackOptOutReason(optOutReason);
        setOptOutSuccessMessage("You have successfully opted out of notifications.");
      })
      .catch((error) => {
        setFormErrorMessage("There was an error updating your preferences. Please try again.");
      })
      .finally(() => {
        setPending(false);
      });
  }

  const optOutUser = async () => {
    let data = { optout: true };
    await updateUser(auth.user.uid, data);
  }

  const setFormErrorMessage = (message) => {
    setFormAlert({
      type: "error",
      message: message,
    });
  }

  const setOptOutSuccessMessage = (message) => {
    setFormAlert({
      type: "success",
      message: message,
    });
  }

  const trackOptOutReason = (optOutReason) => {
    analytics.track('optOut', { reason: optOutReason });
  }

  return (
    <div>
      <p>Opt out of notifications</p>

      <Form onSubmit={processOptOut}>

        {formAlert && (
          <FormAlert type={formAlert.type} message={formAlert.message} />
        )}

        <Form.Group controlId="optOutReason">
          <Form.Label>Opt out reason:</Form.Label>
          <Form.Control
            as="select"
            name="optOutReason"
            defaultValue="Select a reason"
          >
            <option disabled>Select a reason</option>
            <option value={RECEIVED_DOSE_OPT_OUT_REASON}>Received vaccine dose or appointment</option>
            <option value={OTHER_OPT_OUT_REASON}>Other</option>
          </Form.Control>
        </Form.Group>

        <Button type="submit" disabled={pending}>
          <span>Opt out</span>

          {pending && (
            <Spinner
              animation="border"
              size="sm"
              role="status"
              aria-hidden={true}
              className="ml-2 align-baseline"
            >
            <span className="sr-only">Updating...</span>
            </Spinner>
          )}
        </Button>
      </Form>
    </div>
  );
}

export default OptOut;
