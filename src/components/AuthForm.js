import React, { useState, useRef } from "react";
import {Form, Button, Spinner} from "react-bootstrap";
import FormField from "./FormField";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import "./Auth.scss";

function AuthForm(props) {
  const { onAuth } = props;
  const auth = useAuth();

  const ageGroups = ["18-49", "50-59", "60-79", "80+"]
  const eligibilityGroups = ["Congregate living for seniors", "Health care workers", "Adults in First Nations, Métis and Inuit populations", "Adult chronic home care recipients", "High-risk congregate settings", "Individuals with high-risk chronic conditions and their caregivers"]
  const provinces= [ "AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"]

  const [pending, setPending] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [renderRecaptcha, setRenderRecaptcha] = useState(true);
  const [userData, setUserData] = useState({})
  const [otpCode, setOtpCode] = useState({});

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setOtpCode({[name]: value });
  };
  const requestOTPCode = async (data) => {
    // e.preventDefault();
    data.postal = data.postal.toUpperCase();
    setUserData(data);
    setPending(true);
    // auth.setUpRecaptcha();
    await auth.setUpRecaptcha();
    console.log(data)
    const otpRequestSent = await sendOTPCode(data.phoneNumber);
    setPending(false);
    if (otpRequestSent) {
      setShowOTP(true);
    } 
  }

  const sendOTPCode = async (phoneNumber) => {
    // await auth.setUpRecaptcha();
    return await auth.requestOTPCode(phoneNumber);
  }

  const resetRecaptcha = () => {
    setRenderRecaptcha(false);
    setRenderRecaptcha(true);
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    console.log(otpCode)
    setPending(true);
    let otpInput = otpCode.otp;
    // const userData = {
    //   postalCode: "L3Z 2F4",
    //   province: "ON"
    // }
    const success = await auth.submitOTPCode(otpInput, userData);
    setPending(false)
    if (success) {
      onAuth();
    }
  };
  const [groupError, setGroupError] = useState(false);
  const { handleSubmit, register, errors, getValues } = useForm();

  const error = (errorType, field="") => {
    const error = {
      required: `Please enter a ${field}`,
      invalid: `Please enter a valid ${field}`,
      noGroup: "Please select at least one age group or eligibility group"
    }
    return error[errorType];
  }

  const onSubmit = (data) => {
    if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
      setGroupError(true);
      const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
      for (let i = 0; i < allCheckBoxes.length; i++) {
        allCheckBoxes[i].addEventListener("click", function() {
          setGroupError(!this.checked)
        });
      }
    } else {
      setGroupError(false);
      setPending(true);
    }

    const selectedAgeGroups = [];
    const selectedEligibilityGroups = [];

    const allSelectedGroups = document.querySelectorAll('input[type="checkbox"]:checked')
    console.log(allSelectedGroups);
    allSelectedGroups.forEach((group) => {
      if (ageGroups.includes(group.id)) {
        selectedAgeGroups.push(group.id);
      } else if (eligibilityGroups.includes(group.id)) {
        selectedEligibilityGroups.push(group.id);
      }
    })

    data.selectedAgeGroups = selectedAgeGroups;
    data.eligibilityGroups = selectedEligibilityGroups;
    
    requestOTPCode(data);
    
  }

  return (
    <div>
    <Form onSubmit={handleSubmit(onSubmit)} style={{display: showOTP ? "none": null }}>
      {["signup", "signin"].includes(props.type) && (
        <Form.Group controlId="phoneNumber">
          <FormField
            name="phoneNumber"
            type="tel"
            label="Phone Number"
            placeholder="000-000-000"
            error={errors.phoneNumber}
            inputRef={register({
              required: error("required", "phone number"),
              pattern: {
                value: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                message: error("invalid", "phone number")
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
                style={{textTransform: 'uppercase'}}
                error={errors.postal}
                placeholder="A0A 0A0"
                inputRef={register({
                  required: error("required", "postal code"),
                  pattern: {
                    value: /(^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$)|(^\d{5}$)/,
                    message: error("invalid", "postal code")
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
                    message: error("required", "province")
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
                    className="mr-3 ageGroupField"
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
                <div key={eligibilityGroup}>
                  <Form.Check 
                    className="my-2 eligibilityGroupField"
                    type="checkbox"
                    id={eligibilityGroup}
                    label={eligibilityGroup}
                  />
                </div>
              ))}
            </Form.Group> 
          </div>

          {groupError && (
            <Form.Control.Feedback className="text-left groupError">
              {error("noGroup")}
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
    {showOTP && 
      <Form className="form" onSubmit={onSubmitOtp}>
                <h2 className="mb-3">Enter OTP</h2>
                  <Form.Group>
                    <Form.Control
                      id="otp"
                      type="number"
                      name="otp"
                      placeholder="OTP"
                      onChange={onChangeHandler}
                    />
                    <Button variant="secondary" onClick={() => {resetRecaptcha();sendOTPCode(userData.phoneNumber)} }>Resend Code</Button>
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    {!pending && <span>Submit</span>}
                      {pending && (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden={true}
                            className="align-baseline mr-1"
                          >
                          </Spinner>
                          <span>Loading...</span>
                        </>
                      )}
                  </Button>
                  <Button variant="secondary" onClick={()=>setShowOTP(false)}>Go Back</Button>
                </Form>
          }
          {renderRecaptcha && <div id="recaptcha-container"></div>}
    </div>
  );
}

export default AuthForm;
