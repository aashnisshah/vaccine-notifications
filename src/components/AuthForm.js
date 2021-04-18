import React, { useState, useRef } from "react";
import {Form, Button, Spinner} from "react-bootstrap";
import FormField from "./FormField";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import "./Auth.scss";

function AuthForm(props) {
  const auth = useAuth();

  // this.phoneNumber = React.createRef();
  // this.postalCode = React.createRef();
  // this.province = React.createRef();
  const ageGroupField = useRef();
  const eligibilityGroupField = useRef();

  const ageGroups = ["18-49", "50-59", "60-79", "80+"]
  const eligibilityGroups = ["Congregate living for seniors", "Health care workers", "Adults in First Nations, Métis and Inuit populations", "Adult chronic home care recipients", "High-risk congregate settings", "Individuals with high-risk chronic conditions and their caregivers"]
  const provinces= [ "AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"]

  const [pending, setPending] = useState(false);
  const [groupError, setGroupError] = useState(false);
  const { handleSubmit, register, errors, getValues } = useForm();

  const error = (field="", errorType) => {
    const error = {
      required: `Please enter a ${field}`,
      invalid: `Please enter a valid ${field}`
    }
    return error[errorType];
  }

  const submit = (e, onSubmit) => {
    e.preventDefault()
    console.log("hi")
    if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
      setGroupError(true);

      const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
      for (var i = 0; i < allCheckBoxes.length; i++) {
        allCheckBoxes[i].addEventListener("change", function() {
          if (this.checked) {
            setGroupError(false);
          }
        });
      }
    } else {
      setGroupError(false);
      setPending(true);
    }

    handleSubmit("onSubmit");
  }

  // const submitHandlersByType = {
  //   signin: ({ email, pass }) => {
  //     return auth.signin(email, pass).then((user) => {
  //       // Call auth complete handler
  //       props.onAuth(user);
  //     });
  //   },
  //   signup: ({ email, pass }) => {
  //     return auth.signup(email, pass).then((user) => {
  //       // Call auth complete handler
  //       props.onAuth(user);
  //     });
  //   },
  // };

  // // Handle form submission
  // const onSubmit = ({ email, pass }) => {
  //   // Show pending indicator
  //   setPending(true);

  //   // Call submit handler for auth type
  //   submitHandlersByType[props.type]({
  //     email,
  //     pass,
  //   }).catch((error) => {
  //     setPending(false);
  //     // Show error alert message
  //     props.onFormAlert({
  //       type: "error",
  //       message: error.message,
  //     });
  //   });
  // };

  // const handleSubmit = () => {
  //   verifyField();
  // }

  return (
    <Form onSubmit={(e) => submit(e)}>
      {["signup", "signin"].includes(props.type) && (
        <Form.Group controlId="phoneNumber">
          <FormField
            name="phoneNumber"
            type="tel"
            label="Phone Number"
            placeholder="000-000-000"
            error={errors.phoneNumber}
            inputRef={register({
              required: error("phone number", "required"),
              pattern: {
                value: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                message: error("phone number", "invalid")
              }
            })}
          />
        </Form.Group>
      )}

      {["signup"].includes(props.type) && (
        <> 
          <Form.Row className="m-0 justify-content-between">
            <Form.Group controlId="formPostal" className="flex-fill mr-2">
              <FormField
                name="postal"
                label="Postal Code"
                error={errors.postal}
                placeholder="A0A 0A0"
                inputRef={register({
                  required: error("postal code", "required"),
                  pattern: {
                    value: /^(?!.*[DFIOQU])[A-VXY][0-9][A-Z] ?[0-9][A-Z][0-9]$/,
                    message: error("postal code", "invalid")
                  }
                })}
              />
            </Form.Group>
            <Form.Group controlId="province">
              <FormField
                name="province"
                type="select"
                options={provinces}
                defaultValue="--"
                label="Province"
                error={errors.province}
                inputRef={register({
                  pattern: {
                    value: /^((?!--).)*$/,
                    message: error("province", "required")
                  }
                })}
              />
            </Form.Group>
          </Form.Row>

          <div className="my-4">
            <h2 className="selectGroupText">Select all age groups to recieve notifications for. </h2>
            <Form.Row controlId="ageGroup" className="mx-0">
              {ageGroups.map((ageGroup) => (
                <div key={ageGroup} >
                  <Form.Check 
                    className="mr-3"
                    type="checkbox"
                    id={ageGroup}
                    label={ageGroup}
                  />
                </div>
              ))}
            </Form.Row>
          </div>
          
          <div className="my-4">
            <h2 className="selectGroupText">Select all eligibility groups groups to recieve notifications for.</h2>
            <Form.Group controlId="eligibilityGroup" required>
              {eligibilityGroups.map((eligibilityGroup) => (
                <div key={eligibilityGroup} >
                  <Form.Check 
                    className="my-2"
                    type="checkbox"
                    id={eligibilityGroup}
                    label={eligibilityGroup}
                  />
                </div>
              ))}
            </Form.Group> 
          </div>

          {groupError && (
            <Form.Control.Feedback type="invalid" className="text-left">
              {error("age group or eligibility group", "required")}
            </Form.Control.Feedback>
          )}
        </>
      )}

      <Button
        variant="primary"
        block={true}
        size="lg"
        type="submit"
        disabled={pending}
      >
        {!pending && <span>{props.typeValues.buttonText}</span>}

        {pending && (
          <Spinner
            animation="border"
            size="sm"
            role="status"
            aria-hidden={true}
            className="align-baseline"
          >
            <span className="sr-only">Loading...</span>
          </Spinner>
        )}
      </Button>
    </Form>
  );
}

export default AuthForm;
