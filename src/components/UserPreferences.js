import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import FormAlert from "./FormAlert";
import FormField from "./FormField";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import { ageGroups, eligibilityGroups, provinces, cities } from "./formConstants";

function UserPreferences(props) {
    const auth = useAuth();
    const [pending, setPending] = useState(false);
    const [editing, setEditing] = useState(false);
    const { register, handleSubmit, errors } = useForm();
    const [formAlert, setFormAlert] = useState(null);
    const [shouldDisplayCity, setShouldDisplayCity] = useState(false);
    const [citiesToDisplay, setCitiesToDisplay] = useState([]);
    const [groupError, setGroupError] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    // State to control whether we show a re-authentication flow
    // Required by some security sensitive actions, such as changing password.
    const [reauthState, setReauthState] = useState({
        show: false,
    });

    useEffect(() => {
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        setIsMobile(true);
        console.log('check')
      }
    }, [])

    useEffect(() => {
        showCitiesOnLoad();
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({isSignedIn: true}));
        }

        return () => {
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
    
    useEffect(() => {
        checkNeccessaryFields();
    }, [auth.user, editing])

    const checkNeccessaryFields = () => {
        if (auth.user.optout) {
            setFormAlert({type:"warning", message: "You have opted out of notifications, to opt in click the 'Opt in' button"});
        } else if(!auth.user.expoToken) {
            setFormAlert({type:"warning", message: "Download the 'Vaccine Notifications' app to receive mobile notifications"});
        } else if (!auth.user.postal || !auth.user.province || ! (auth.user.eligibilityGroups && auth.user.ageGroups)) {
            setEditing(true);
            setFormAlert({type:"warning", message: "Fill out empty fields to receive notifications!"});
        } else {
            setFormAlert({type:"success", message: "You're all set to receive mobile notifications!"});
        }
    }

    const showCitiesOnLoad = async () => {
        if (auth.user.city && auth.user.province) {
            await displayCity();
            document.getElementById('city').value = auth.user.city;
        }
    }

    const displayCity = async () => {
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

    const formatPhoneNumber = (str) => {
        if (!str) return;
        //Filter only numbers from the input
        let cleaned = ("" + str).replace(/\D/g, "");

        //Check if the input is of correct
        let match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);

        if (match) {
            //Remove the matched extension code
            //Change this to format for any country code.
            let intlCode = match[1] ? "+1 " : "";
            return [
                intlCode,
                "(",
                match[2],
                ") ",
                match[3],
                "-",
                match[4],
            ].join("");
        }

        return null;
    };

    const formatPostalCode = (str) => {
        if (str) {
            return str.substring(0, 3) + " " + str.substring(3, 6);
        }
    };

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

    const onSubmit = async (data) => {
        // data.phoneNumber = data.phoneNumber.replace(/[- )(]/g,'')
        if (auth.user.phoneNumber) {
            data.phoneNumber = auth.user.phoneNumber;
        }
        if (auth.user.email) {
            data.email = auth.user.email;
        }

        if (document.getElementById("city")) {
            data.city = document.getElementById("city").value;
        } else {
            data.city = ""
        }

        if (
            document.querySelectorAll('input[type="checkbox"]:checked')
                .length === 0
        ) {
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

            data.ageGroups = selectedAgeGroups;
            data.eligibilityGroups = selectedEligibilityGroups;
            data.postal = data.postal.replace(/\s/g, "").toUpperCase();

            try {
                await auth.updateProfile(data);
                // onStatus({
                //     type: "success",
                //     message: "You're all set to receive notifications!",
                // });
            } catch (error) {
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
            }
            setPending(false);
            setEditing(false);
            window.scrollTo(0,0);
        }
    };

    const selectAll = (className) => {
        document
            .querySelectorAll(`.${className} input[type='checkbox']`)
            .forEach((checkbox) => {
                checkbox.checked = true;
            });
    };

    return (
        <Form className="mb-4" onSubmit={handleSubmit(onSubmit)}>
            {formAlert && (
                <FormAlert type={formAlert.type} message={formAlert.message} />
            )}
            <Form.Group>
                <FormField
                    label="Username"
                    defaultValue={auth.user.email ? auth.user.email : formatPhoneNumber(auth.user.phoneNumber)}
                    error={errors.username}
                    disabled
                />
            </Form.Group>
            <Form.Group controlId="formPostalCode">
                <FormField
                    name="postal"
                    type="text"
                    label="Postal Code"
                    style={{ textTransform: "uppercase" }}
                    disabled={!editing}
                    defaultValue={formatPostalCode(auth.user.postal)}
                    placeholder="i.e. A1A 1A1"
                    error={errors.postalcode}
                    inputRef={register({
                        required:
                            "Please enter your Postal Code in 'A1A 1A1' format",
                    })}
                />
            </Form.Group>
            <Form.Group controlId="formProvince">
                <FormField
                    name="province"
                    id="province"
                    type="select"
                    disabled={!editing}
                    options={provinces}
                    label="Province"
                    defaultValue={auth.user.province ? auth.user.province : "--" }
                    placeholder="Province"
                    error={errors.province}
                    onChange = {displayCity}
                    inputRef={register({
                        required: "Please enter your Province",
                    })}
                />
            </Form.Group>
            
            {shouldDisplayCity && (
                <Form.Group>
                    <FormField
                        name="city"
                        type="select"
                        disabled={!editing}
                        options={citiesToDisplay}
                        defaultValue="--"
                        // value={auth.user.city ? auth.user.city : "--"}
                        label="City"
                        id="city"
                    />
                </Form.Group>
            )}

            {editing ? (
                <>
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
                            Select all relevant eligibility groups to recieve
                            notifications for.
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
                            onClick={() => selectAll("eligibilityGroupField")}
                            variant="link"
                            className="p-0"
                        >
                            Select all
                        </Button>
                    </div>
                </>
            ) : (
                <>
                    <div className="my-4">
                        <h2 className="selectGroupText">
                            Selected age groups to recieve notifications for.{" "}
                        </h2>
                        <Form.Row controlId="ageGroup" className="mx-0">
                            {auth.user.ageGroups && auth.user.ageGroups.map((ageGroup) => (
                                <div key={ageGroup}>
                                    <Form.Check
                                        className="mr-3 ageGroupField"
                                        type="checkbox"
                                        checked={true}
                                        disabled
                                        id={ageGroup}
                                        label={ageGroup}
                                    />
                                </div>
                            ))}
                        </Form.Row>
                    </div>
                    <div className="my-4">
                        <h2 className="selectGroupText">
                            Selected eligibility groups to recieve notifications
                            for.
                        </h2>
                        <Form.Group controlId="eligibilityGroup" required>
                            {auth.user.eligibilityGroups && auth.user.eligibilityGroups.map(
                                (eligibilityGroup) => (
                                    <div key={eligibilityGroup}>
                                        <Form.Check
                                            className="my-2 eligibilityGroupField"
                                            type="checkbox"
                                            checked={true}
                                            disabled
                                            id={eligibilityGroup}
                                            label={eligibilityGroup}
                                        />
                                    </div>
                                )
                            )}
                        </Form.Group>
                    </div>
                </>
            )}

            {editing ? (
                <Form.Row>
                    <Button
                        variant="success"
                        type="submit"
                        className="mr-2"
                        disabled={pending}
                    >
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
                    <Button
                        variant="secondary"
                        onClick={() => {setEditing(false); window.scrollTo(0,0);}}
                    >
                        Cancel
                    </Button>
                </Form.Row>
            ) : (
                <Button
                    variant="primary"
                    onClick={() => setEditing(true)}
                    disabled={pending}
                >
                    Edit
                </Button>
            )}

            {isMobile && !editing && (
              <Button
               variant="secondary"
               onClick={(e) => {
                e.preventDefault();
                auth.signout();
              }}
               disabled={pending}
               className="ml-2"
              >
                  Sign Out
              </Button>
            )}
        </Form>
    );
}

export default UserPreferences;
