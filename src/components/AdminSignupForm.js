import React, { useEffect, useState } from "react";
import { Form, Button, Spinner, Row, Col, Image } from "react-bootstrap";
import { Link } from "../util/router.js";
import { useAuth } from "../util/auth.js";
import { useForm } from "react-hook-form";

import FormField from "./FormField";
import { error, selectAll, ageGroups, eligibilityGroups, cities, provinces } from "./formConstants";

function AdminSignupForm(props) {
  const { onAuth } = props;
  const auth = useAuth();
  const { handleSubmit, register, errors, getValues, trigger } = useForm();
  
  const [pending, setPending] = useState(false);
  const [isOptedIn, setIsOptedIn] = useState(false);
  const [groupError, setGroupError] = useState("");
  const [shouldDisplayCity, setShouldDisplayCity] = useState(false);
  const [citiesToDisplay, setCitiesToDisplay] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFail, setIsFail] = useState(false);

  const onSubmit = async (data) => {
    const passwordInput = data.password;
    delete data.password;

    setPending(true);

    if (isOptedIn) {
      if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
        setGroupError(true);
        const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
        for (let i = 0; i < allCheckBoxes.length; i++) {
            allCheckBoxes[i].addEventListener("click", function () {
                setGroupError(!this.checked);
            });
        }
      } else {
        setGroupError(false);
        setPending(true);

        const selectedAgeGroups = [];
        const selectedEligibilityGroups = [];

        const allSelectedGroups = document.querySelectorAll(
            'input[type="checkbox"]:checked'
        );

        allSelectedGroups.forEach((group) => {
            if (ageGroups.includes(group.id)) {
                selectedAgeGroups.push(group.id);
            } else if (eligibilityGroups.includes(group.id)) {
                selectedEligibilityGroups.push(group.id);
            }
        });

        if (document.getElementById("city")) {
          const cityElement = document.getElementById("city").value
          if (cityElement === "Other" || cityElement === "") {
              data.city = "";
          } else {
              data.city = cityElement;
          }
        }
        
        data.optout = false;
        data.admin = false;
        data.ageGroups = selectedAgeGroups;
        data.eligibilityGroups = selectedEligibilityGroups;
        data.postal = data.postal.replace(/\s/g, "").toUpperCase().trim();
        data.postalShort = data.postal.substring(0, 3);

        if (localStorage.getItem("ExpoToken")) {
            console.log(localStorage.getItem("ExpoToken"))
            data.expoToken = localStorage.getItem("ExpoToken");
        }
      }
    }
    const authResponse = await auth.signup(data, passwordInput);
    setPending(false);

    if (authResponse.status === 200) {
      setIsSuccess(true);
      setIsFail(false);
    } else {
      setIsFail(true);
      setIsSuccess(false);
    }
  }

  const updateOptedIn = () => {
    const checkbox = document.getElementById("receiveUpdates")
    setIsOptedIn(checkbox.checked);
  }
  
  const displayCity = () => {
    const selectedProvince = document.getElementById("province").value
    if (Object.keys(cities).includes(selectedProvince)) {
        const citiesForProvince = cities[selectedProvince]
        if (!citiesForProvince.includes("Other")) {
            citiesForProvince.push("Other")
        }
        
        setCitiesToDisplay(citiesForProvince)
        setShouldDisplayCity(true)
    } else {
        setShouldDisplayCity(false)
    }
  }

  return (
    <>
      {!isSuccess ? (
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group>
            <FormField
              name="email"
              label="Email"
              type="email"
              placeholder="Email"
              error={errors.email}
              inputRef={register({
                  required: error("required", "email"),
                  pattern: {
                    value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                    message: error("invalid", "email")
                  }
              })}
            />
          </Form.Group>
          <Form.Group>
            <FormField
              id="password"
              label="Password"
              name="password"
              type="password"
              placeholder="Password"
              error={errors.password}
              inputRef={register({
                required: error("required", "password"),
                minLength: {
                    value: 6,
                    message: error("passwordLength")
                  }
              })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Row>
              <Col>
                <FormField
                  name="firstName"
                  label="First Name"
                  placeholder="First Name"
                  error={errors.firstName}
                  inputRef={register({
                      required: error("required", "first name"),
                  })}
                />
              </Col>
              <Col>
                <FormField
                  name="lastName"
                  label="Last Name"
                  placeholder="Last Name"
                  error={errors.lastName}
                  inputRef={register({
                      required: error("required", "last name"),
                  })}
                />
              </Col>
            </Form.Row>
          </Form.Group>
          <Form.Group>
            <FormField
              name="facility"
              label="Which healthcare facility will you be providing updates for?"
              placeholder="Name of hospital, clinic etc."
              error={errors.facility}
              inputRef={register({
                required: error("required", "healthcare facility"),
              })}
            />
          </Form.Group>
          <Form.Group>
            <FormField
              name="contact"
              label="What is the phone number of the healthcare facility listed above?"
              error={errors.contact}
              inputRef={register({
                required: error("required", "phone number of the facility"),
                pattern: {
                  value: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                  message: error("invalid", "phone number"),
                }
              })}
            />
          </Form.Group>
          <Form.Group>
            <FormField
              name="role"
              as="textarea"
              label="What is your role at the facility?"
              error={errors.role}
              inputRef={register({
                required: error("required", "role"),
              })}
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              className="mt-4"
              type="checkbox"
              label="Would you like to recieve updates about vaccine availability?"
              id="receiveUpdates"
              onClick={updateOptedIn}
            />
          </Form.Group>

          {isOptedIn && (
            <>
            <Form.Group>
              <FormField
                  name="province"
                  type="select"
                  options={provinces}
                  defaultValue="--"
                  label="Province"
                  error={errors.province}
                  id="province"
                  onChange = {displayCity}
                  inputRef={register({
                      pattern: {
                          value: /^((?!--).)*$/,
                          message: error("required", "province"),
                      },
                  })}
              />
          </Form.Group>
          {shouldDisplayCity && (
              <Form.Group>
                  <FormField
                      name="city"
                      type="select"
                      options={citiesToDisplay}
                      defaultValue="--"
                      label="City"
                      id="city"
                  />
              </Form.Group>
          )}
          <Form.Group controlId="formPostal">
              <FormField
                  name="postal"
                  label="Postal Code"
                  style={{ textTransform: "uppercase" }}
                  error={errors.postal}
                  placeholder="A0A 0A0"
                  inputRef={register({
                      required: error(
                          "required",
                          "postal code"
                      ),
                      pattern: {
                          value: /^[ABCEGHJ-LNPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d/i,
                          message: error(
                              "invalid",
                              "postal code"
                          ),
                      },
                  })}
              />
          </Form.Group>
            <div className="my-4">
              <h2 className="selectGroupText">
                  Select all relevant age groups to recieve
                  notifications for.{" "}
              </h2>
              <Form.Row controlId="ageGroup" className="mx-0">
                  {ageGroups.map((ageGroup) => (
                      <div key={ageGroup}>
                          <Form.Check
                              className="mr-3 ageGroupField"
                              type="checkbox"
                              id={ageGroup}
                              label={ageGroup}
                          />
                      </div>
                  ))}
              </Form.Row>
              <Button
                  onClick={() => selectAll("ageGroupField")}
                  variant="link"
                  className="p-0"
              >
                Select all
              </Button>
            </div>

            <div className="my-4">
                <h2 className="selectGroupText">
                    Select all relevant eligibility groups to
                    recieve notifications for.
                </h2>
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
                <Button
                    onClick={() =>
                        selectAll("eligibilityGroupField")
                    }
                    variant="link"
                    className="p-0"
                >
                    Select all
                </Button>
            </div>
            </>
          )}

          {groupError && (
            <Form.Control.Feedback className="text-left groupError">{error("noGroup")}</Form.Control.Feedback>
          )}

          {isFail && (
            <Form.Control.Feedback className="text-left groupError">Something went wrong. Please try again</Form.Control.Feedback>
          )}  

          <Button
            variant="primary"
            type="submit"
            disabled={pending}
            size="lg"
            className="my-2"
          >
            {!pending && <span>Submit</span>}

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
      ) : (
        <>
          <h5>Thanks for your application</h5>
          <p>Thanks for your application. A member of our team will review your submission and contact you when your account is approved. When your account is approved you can start sending updates to members of different age/eligibility groups, and residents of specifics regions. We appreciate all the health care workers trying to make this process smoother, and we look forward to working with you!</p>
        </>
      )}
    </>
  )
};

export default AdminSignupForm;
