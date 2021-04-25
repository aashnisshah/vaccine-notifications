import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Spinner } from "react-bootstrap";
import FormField from "./FormField";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import {
    ageGroups,
    eligibilityGroups,
    provinces,
    error,
    cities,
    selectAll,
} from "./formConstants";
import "./Auth.scss";

function AuthForm(props) {
    const { onAuth } = props;
    const auth = useAuth();

    const [page, setPage] = useState(1);
    const [usernameType, setUsernameType] = useState("email");
    const [usernameInput, setUsernameInput] = useState("");
    const [passwordInput, setPasswordInput] = useState("");
    const [shouldDisplayCity, setShouldDisplayCity] = useState(false);
    const [citiesToDisplay, setCitiesToDisplay] = useState([]);

    const [showOTP, setShowOTP] = useState(false);
    const [renderRecaptcha, setRenderRecaptcha] = useState(true);
    const [otpCode, setOtpCode] = useState({});

    const [nextPending, setNextPending] = useState(false);
    const [pending, setPending] = useState(false);
    const [groupError, setGroupError] = useState(false);

    const { handleSubmit, register, errors, getValues, trigger } = useForm();

    useEffect(() => {
        document.addEventListener("keydown", handleEnter);

        return () => {
            document.removeEventListener("keydown", handleEnter)
            const allCheckBoxes = document.querySelectorAll(
                'input[type="checkbox"]'
            );
            allCheckBoxes.forEach((checkBox) => {
                checkBox.removeEventListener("click", function () {
                    setGroupError(!this.checked);
                });
            });
        };
    }, []);

    const handleEnter = (e) => {
      if (e.key === "Enter") {
        e.preventDefault()
      }
    }

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setOtpCode({ [name]: value });
    };

    const requestOTPCode = async (phoneNumber) => {
        // setUserData(data);
        setPending(true);
        await auth.setUpRecaptcha();
        const otpRequestSent = await sendOTPCode(phoneNumber);
        setPending(false);
        if (otpRequestSent) {
            setShowOTP(true);
        }
    };

    const sendOTPCode = async (phoneNumber) => {
        const isSignIn = props.type === "signin";
        return await auth.requestOTPCode(phoneNumber, isSignIn);
    };

    const resetRecaptcha = () => {
      setRenderRecaptcha(false);
      setTimeout(setRenderRecaptcha(true), 100);
    };

    const onSubmitOtp = async (e) => {
        e.preventDefault();
        setPending(true);

        const otpInput = otpCode.otp;
        const success = await auth.submitOTPCode(otpInput);

        setPending(false);
        if (success) {
            onAuth();
        }
    };

    const goToNext = async () => {
      setNextPending(true);
      if (props.type === "signin") {
        const result = await trigger("username");
        
        if (result) {
          if (getValues().username.includes("@")) {
            setPage(2);
          } else {
            await requestOTPCode(getValues().username.replace(/[- )(]/g, ""));
            setUsernameType("phoneNumber");
          }
        };
      } else if (props.type === "signup") {
        const result = await trigger(["email", "password", "confirmPassword"]);

        setUsernameInput(getValues().email);
        setPasswordInput(getValues().password);

        if (result) { setPage(2) };
      }
      setNextPending(false);
    };

    const onSubmit = async (data) => {
        let authResponse = "";
        if (props.type === "signup") {
            if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
                setGroupError(true);
                const allCheckBoxes = document.querySelectorAll(
                    'input[type="checkbox"]'
                );
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

                // TEMP WORK AROUND FOR REACT HOOK FORM ISSUES
                if (data.email) {
                  delete data.email
                }
                if (data.password) {
                  delete data.password
                }
                if (data.confirmPassword) {
                  delete data.confirmPassword
                }
                
                data.optout = false;
                data.ageGroups = selectedAgeGroups;
                data.eligibilityGroups = selectedEligibilityGroups;
                data.postal = data.postal.replace(/\s/g, "").toUpperCase();
                data.postalShort = data.postal.substring(0, 3);
                data.email = usernameInput;

                authResponse = await auth.signup(data, passwordInput);
            }
        } else if (props.type === "signin") {
          setPending(true)
          authResponse = await auth.signin(getValues().username, getValues().password);
        }

        if (authResponse.status === 200) {
          onAuth();
        }
    };

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
        <div>
            <Form onSubmit={handleSubmit(onSubmit)} style={{ display: showOTP ? "none" : null }}>
                {["signin"].includes(props.type) && (
                  <>
                    <h6 className="mb-4">If you signed up with your email, enter below. Otherwise if you signed up with your phone number, enter below.</h6>
                    <Form.Group>
                        <FormField
                            id="username"
                            name="username"
                            label="Email or Phone Number"
                            error={errors.username}
                            inputRef={register({
                                required: error("required", "phone number or email"),
                                pattern: {
                                  value: /^(([(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$)|(\S+@\S+\.\S))/,
                                  message: error("invalid", "phone number or email")
                                }
                            })}
                        />
                    </Form.Group>
                  </>
                )}

                { page === 1 && ["signup"].includes(props.type) && (
                  <Form.Group>
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      id="email"
                      placeholder="Email"
                      error={errors.email}
                      inputRef={register({
                        required: error("required", "email"),
                      })}
                    />
                  </Form.Group>
                )}

                { ((page === 1 && ["signup"].includes(props.type)) ||
                (page === 2 && ["signin"].includes(props.type) && usernameType === "email")) && (
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
                        pattern: {
                            value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/,
                            message: error("passwordLength")
                          }
                      })}
                    />
                  </Form.Group>
                )}

                { page === 1 && ["signup"].includes(props.type) && (
                  <Form.Group controlId="formConfirmPass">
                    <FormField
                      label="Confirm Password"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm Password"
                      error={errors.confirmPassword}
                      inputRef={register({
                        required: error("required", "password"),
                        validate: (value) => {
                          if (value === getValues().password) {
                            return true;
                          } else {
                            return "This doesn't match your password";
                          }
                        },
                      })}
                    />
                  </Form.Group>
                )}

                { page === 1 && (
                  <div className="w-100 justify-content-end d-flex forwardBackButton">
                    <Button variant="link" onClick={goToNext} disabled={nextPending}>
                      { nextPending ? 
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden={true}
                          className="align-baseline"
                        />
                      : 
                        <p>Next &nbsp; &#8594;</p>
                      }
                    </Button>
                  </div>
                ) }

                { page === 2 && ["signup"].includes(props.type) && (
                    <>
                        <Form.Row className="m-0 justify-content-between">
                            <Form.Group className="mr-2 w-25">
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
                                <Form.Group className="mr-2 w-25">
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
                            <Form.Group controlId="formPostal" className="flex-grow-1">
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
                                            value: /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i,
                                            message: error(
                                                "invalid",
                                                "postal code"
                                            ),
                                        },
                                    })}
                                />
                            </Form.Group>
                        </Form.Row>

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

                        <div className="w-100 justify-content-start d-flex forwardBackButton">
                          <Button variant="link" onClick={() => setPage(1)}>
                            &#8592; &nbsp; Back
                          </Button>
                        </div>

                        {groupError && (
                            <Form.Control.Feedback className="text-left groupError">
                                {error("noGroup")}
                            </Form.Control.Feedback>
                        )}
                    </>
                )}

                { page === 2 && (
                  <div className="w-100 text-center">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={pending}
                        size="lg"
                        className="my-2"
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
                  </div>
                )}
            </Form>

            {showOTP && (
              <Form className="form" onSubmit={onSubmitOtp}>
                    <h2 className="selectGroupText">Enter Verification Code</h2>
                    <p>
                        A verification code was sent via SMS to the provided
                        number. Enter the number below to access your account.
                    </p>
                    <Form.Group>
                        <FormField
                            id="otp"
                            type="number"
                            name="otp"
                            placeholder="Verification Code"
                            onChange={onChangeHandler}
                        />
                    </Form.Group>

                    <div className="d-flex">
                        <Button
                            variant="primary"
                            type="submit"
                            // size="lg"
                            className="my-2, mr-2"
                        >
                            {!pending && <span>Submit</span>}
                            {pending && (
                                <>
                                    <Spinner
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden={true}
                                        className="align-baseline mr-1"
                                    ></Spinner>
                                    <span>Loading...</span>
                                </>
                            )}
                        </Button>
                        <Button
                            variant="link"
                            onClick={() => {
                                resetRecaptcha(); //TO DO: Display message
                                console.log(getValues().username)
                                sendOTPCode(getValues().username);
                            }}
                            >
                            <u>Resend Link</u>
                        </Button>
                    </div>
                    {/* <Button  // TO DO ADD BACK BUTTON
              variant="secondary" 
              onClick={()=>setShowOTP(false)}
              size="lg"
            >
                Go Back
            </Button> */}
                </Form>
            )}

            {renderRecaptcha && <div id="recaptcha-container"></div>}
        </div>
    );
}

export default AuthForm;
