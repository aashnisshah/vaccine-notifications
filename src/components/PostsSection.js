import React, { useState, useEffect } from "react";
import { Container, Form, Spinner, Button, Row, Col, Card } from "react-bootstrap";
import { useRouter, history } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import { getMessageBody, getSendTo } from '../helpers/FormatPostMessage';
import FormField from "./FormField";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import FormAlert from "./FormAlert";
import {
    ageGroups,
    eligibilityGroups,
    provinces,
    provincesWAll,
    messageTypeOptions,
    error,
    selectAll,
    cities,
} from "./formConstants";
import { sendTargettedMessages } from "../util/expo";

function PostsSection(props) {
    const auth = useAuth();
    const router = useRouter();
    const { handleSubmit, register, errors, reset } = useForm();

    const [locationGroup, setLocationGroup] = useState("");
    const [citiesToDisplay, setCitiesToDisplay] = useState([]);
    const [numCities, setNumCities] = useState(1);
    const [numPostals, setNumPostals] = useState(1);
    const [pending, setPending] = useState(false);
    const [groupError, setGroupError] = useState(false);
    const [messageStatus, setMessageStatus] = useState(null);
    const [showPreviewMessage, setShowPreviewMessage] = useState(false);
    const [rawData, setRawData] = useState();
    const [previewMessage, setPreviewMessage] = useState("");
    const [previewSendTo, setPreviewSendTo] = useState([]);

    useEffect(() => {
        if (!auth.user.admin) {
            history.replace("/dashboard");
        }
    }, [auth]);

    useEffect(() => {
        const allCities = [];
        for (const province of Object.keys(cities)) {
            for (const city of cities[province]) {
                allCities.push(city)
            }
        }
        setCitiesToDisplay(allCities)
    }, [])

    let accountConfigured =
        auth.user.phone && auth.user.province && auth.user.postalcode;

    const onSubmit = async (data) => {
        const allPostalCodes = document.querySelectorAll(".postalCodesInput");
        const province = document.querySelector(".province");
        const allCities = document.querySelectorAll(".city")

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
            if (allPostalCodes.length > 0) {
                data.postal = [];
                allPostalCodes.forEach((postal) => {
                    if (!data.postal.includes(postal.value.toUpperCase()) && postal.value != "") {
                        data.postal.push(postal.value.toUpperCase());
                    }
                });
            } else if (allCities.length > 0) {
                data.cities = []
                allCities.forEach((city) => {
                    if (!data.cities.includes(city.value) && city.value != "--") {
                        data.cities.push(city.value)
                    }
                })
            } else if (province && province.value) {
                if (province.value === "All") {
                    data.province = "CA";
                } else {
                    data.province = province.value
                }
            } 
    
            setGroupError(false);
            setPending(true);
    
            const selectedAgeGroups = [];
            const selectedEligibilityGroups = [];
            const allSelectedGroups = document.querySelectorAll('input[type="checkbox"]:checked');
    
            allSelectedGroups.forEach((group) => {
                if (ageGroups.includes(group.id)) {
                    selectedAgeGroups.push(group.id);
                } else if (eligibilityGroups.includes(group.id)) {
                    selectedEligibilityGroups.push(group.id);
                }
            });
    
            data.selectedAgeGroups = selectedAgeGroups;
            data.eligibilityGroups = selectedEligibilityGroups;
            delete data.locationGroup;
    
            if (auth.user.admin) {
                setPending(false);
                setShowPreviewMessage(true);
                setRawData(data);

                const message = await getMessageBody(data);
                const sendTo = await getSendTo(data);

                setPreviewSendTo(sendTo);
                setPreviewMessage(message);
            } else {
                alert("Only admins can post messages");
            }
        }
    };
    
    const sendMessage = async () => {
        try {
            setPending(true);
            // auth.postMessage(rawData);
            console.log('hi hello')
            const res = await sendTargettedMessages(rawData);
            console.log(res)
            setMessageStatus({status:"success", message:"Message Sent!"})
        } catch (error) {
            console.log('this is error')
            console.log(error)
            setMessageStatus({status:"error", message: "Something went wrong!"})
            // setMessageStatus({status:"success", message:"Message Sent!"})
        }
        reset();
        setPending(false);
        setShowPreviewMessage(false);
    }

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container style={{display: showPreviewMessage ? "none": null }}>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />
                {messageStatus && (
                        <FormAlert type={messageStatus.status} message={messageStatus.message} />
                    )
                }
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="my-4">
                        <Col className="border-right" sm={12} lg={6}>
                            <Form.Group
                                controlId="messageType"
                                className="flex-fill"
                            >
                                <FormField
                                    name="messageType"
                                    type="select"
                                    label="Message Type"
                                    options={messageTypeOptions}
                                    error={errors.messageType}
                                    inputRef={register({
                                        required: error("required", "message type"),
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="message">
                                <FormField
                                    name="message"
                                    type="textarea"
                                    rows={5}
                                    label="Message"
                                    placeholder="Provide a short message here."
                                    error={errors.message}
                                    inputRef={register({
                                        required: error("required", "message"),
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="linkToBooking">
                                <FormField
                                    name="linkToBooking"
                                    label="Link To Booking"
                                    helpText="If there's a website users can access to book an appointment, add it here."
                                    error={errors.linkToBooking}
                                    inputRef={register({
                                        pattern: {
                                            value: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                                            message: error("invalid", "link to booking"),
                                        },
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="numberToBooking">
                                <FormField
                                    name="numberToBooking"
                                    type="tel"
                                    label="Phone Number to Booking"
                                    placeholder="000-000-0000"
                                    helpText="If there's a phone number users can call to book an appointment, add it here."
                                    error={errors.numberToBooking}
                                    inputRef={register({
                                        pattern: {
                                            value: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                                            message: error(
                                                "invalid",
                                                "phone number"
                                            ),
                                        },
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="linkToSrc">
                                <FormField
                                    name="linkToSrc"
                                    label="Link To Source"
                                    helpText="If you have a link that users can access to learn more, add it here."
                                    error={errors.linkToSrc}
                                    inputRef={register({
                                        pattern: {
                                            value: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                                            message: error(
                                                "invalid",
                                                "link to source"
                                            ),
                                        },
                                    })}
                                />
                            </Form.Group>
                        </Col>
                        <Col className="pl-4" sm={12} lg={6}>
                            <h2 className="selectGroupText">
                                Select a location group that this message is relevant for.
                            </h2>
                            <Form.Group>
                                <FormField
                                    id="locationGroup"
                                    name="locationGroup"
                                    type="select"
                                    options={["Province", "City", "Postal Code"]}
                                    defaultValue="--"
                                    label="Add a location identifier"
                                    error={errors.locationGroup}
                                    onChange={() => setLocationGroup(document.getElementById("locationGroup").value)}
                                    inputRef={register({
                                        pattern: {
                                            value: /^((?!--).)*$/,
                                            message: error("required", "location identifier"),
                                        },
                                    })}
                                />
                            </Form.Group>

                            {locationGroup === "Province" && (
                                <Col className="p-0 w-50">
                                    <Form.Group controlId="province">
                                        <FormField
                                            name="province"
                                            className="province"
                                            type="select"
                                            options={provincesWAll}
                                            defaultValue="--"
                                            label="Province"
                                            error={errors.province}
                                            inputRef={register({
                                                pattern: {
                                                    value: /^((?!--).)*$/,
                                                    message: error("required", "province"),
                                                },
                                            })}
                                        />
                                    </Form.Group>
                                </Col>
                            )}

                            {locationGroup === "Postal Code" && (
                                <Col className="p-0 pr-2">
                                    <Form.Label className="mb-1">Postal Code</Form.Label>
                                    {[...Array(numPostals)].map(() => (
                                        <Form.Group controlId="formPostal">
                                            <FormField
                                                name="postal"
                                                style={{textTransform: "uppercase",}}
                                                error={errors.postal}
                                                placeholder="A0A"
                                                className="postalCodesInput"
                                                inputRef={register({
                                                    pattern: {
                                                        value: /[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z]$/gi,
                                                        message:"Please enter the first 3 characters of a valid postal code",
                                                    },
                                                    required: {
                                                        message: error("required", "postal code")
                                                    }
                                                })}
                                            />
                                        </Form.Group>
                                    ))}
                                    <Form.Text muted>Add up to 10 postal codes</Form.Text>
                                    <Button
                                        variant="link"
                                        className="px-0"
                                        onClick={() => setNumPostals(numPostals < 10 ? numPostals + 1 : numPostals)}
                                    >
                                        Add another
                                    </Button>
                                </Col>
                            )}

                            {locationGroup === "City" && (
                                <Col className="p-0 w-50">
                                    <Form.Label className="mb-1">
                                        City
                                    </Form.Label>
                                    {[...Array(numCities)].map(() => (
                                        <Form.Group className="mr-2">
                                            <FormField
                                                name="cities"
                                                type="select"
                                                options={citiesToDisplay}
                                                defaultValue="--"
                                                className="city"
                                                inputRef={register({
                                                    pattern: {
                                                        value: /^((?!--).)*$/,
                                                        message: error("required", "city"),
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                    ))}
                                    <Form.Text muted>Add up to 10 cities</Form.Text>
                                    <Button
                                        variant="link"
                                        className="px-0"
                                        onClick={() => setNumCities(numCities < 10 ? numCities + 1 : numCities)}
                                    >
                                        Add another
                                    </Button>
                                </Col>
                            )}

                            <div className="my-4">
                                <h2 className="selectGroupText">
                                    Select all age groups that this message is
                                    relevant to.
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
                                    Select all eligibility groups that this
                                    message is relevant to.
                                </h2>
                                <Form.Group
                                    controlId="eligibilityGroup"
                                    required
                                >
                                    {eligibilityGroups.map(
                                        (eligibilityGroup) => (
                                            <div key={eligibilityGroup}>
                                                <Form.Check
                                                    className="my-2 eligibilityGroupField"
                                                    type="checkbox"
                                                    id={eligibilityGroup}
                                                    label={eligibilityGroup}
                                                />
                                            </div>
                                        )
                                    )}
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
                        </Col>
                    </Row>

                    {groupError && (
                        <Form.Control.Feedback className="text-left groupError">
                            {error("noGroup")}
                        </Form.Control.Feedback>
                    )}

                    <Button
                        variant="primary"
                        block={true}
                        size="lg"
                        type="submit"
                        disabled={pending}
                    >
                        {pending && (
                            <Spinner
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden={true}
                                className="align-baseline mr-1"
                            >
                                <span className="sr-only">Loading...</span>
                            </Spinner>
                        )}
                        Preview Message
                    </Button>
                </Form>
            </Container>
        {showPreviewMessage &&
           <Container className="previewContainer">
               <SectionHeader
                    title={"Preview Message"}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />

                
                <div className="w-100 justify-content-center d-flex">
                  <div className="w-75">
                    <h5>Sending To: </h5>
                    <ul>
                      {previewSendTo.map(group => <li>{group}</li>)}
                    </ul>

                    <Card className="mb-4 previewCard">
                        <Card.Header as="h5">Text Message Preview</Card.Header>
                        <Card.Body>{previewMessage}</Card.Body>
                    </Card>
                    <Form.Row>
                      <Button
                          variant="primary"
                          onClick={sendMessage}
                          className="mr-3"
                          size="lg"
                          disabled={pending}
                          >
                              {pending && (
                                  <Spinner
                                      animation="border"
                                      size="sm"
                                      role="status"
                                      aria-hidden={true}
                                      className="align-baseline mr-1"
                                  >
                                      <span className="sr-only">Loading...</span>
                                  </Spinner>
                              )}
                              Submit Message
                          </Button>
                          <Button
                              variant="secondary"
                              onClick={() => {setShowPreviewMessage(false); setMessageStatus(null)}}
                              size="lg"
                              disabled={pending}
                          >
                              Go Back
                          </Button>
                      </Form.Row>
                  </div>
                </div>
           </Container>
        }
        </Section>
    );
}

export default PostsSection;
