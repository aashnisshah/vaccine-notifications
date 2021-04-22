import React, { useState, useEffect } from "react";
import { Container, Form, Spinner, Button, Row, Col } from "react-bootstrap";
import { useRouter, history } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import {
    ageGroups,
    eligibilityGroups,
    provinces,
    provincesWAll,
    messageTypeOptions,
    error,
    selectAll,
} from "./formConstants";
import { sendTargettedMessages } from "./../util/twilio";

function PostsSection(props) {
    const auth = useAuth();
    const router = useRouter();
    const { handleSubmit, register, errors, reset } = useForm();

    const [numPostals, setNumPostals] = useState(1);
    const [pending, setPending] = useState(false);
    const [groupError, setGroupError] = useState(false);
    const [areaError, setAreaError] = useState(false);
    const [messageStatus, setMessageStatus] = useState(false);

    useEffect(() => {
        if (!auth.user.admin) {
            history.replace("/dashboard");
        }
    }, [auth]);

    let accountConfigured =
        auth.user.phone && auth.user.province && auth.user.postalcode;

    const onSubmit = async (data) => {
        const allPostalCodes = document.querySelectorAll(".postalCodesInput");
        const province = document.querySelector(".province");

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
        }

        data.postal = [];
        allPostalCodes.forEach((postal) => {
            if (
                !data.postal.includes(postal.value.toUpperCase()) &&
                postal.value != ""
            ) {
                data.postal.push(postal.value.toUpperCase());
            }
        });

        if (
            province.value &&
            province.value != "--" &&
            data.postal.length > 0 &&
            data.postal[0] != ""
        ) {
            setAreaError(true);

            for (let i = 0; i < allPostalCodes.length; i++) {
                allPostalCodes[i].addEventListener("change", function (postal) {
                    if (
                        (!province.value && postal.value) ||
                        (province.value && !postal.value)
                    ) {
                        setAreaError(false);
                    }
                });
            }

            province.addEventListener("change", function (postal) {
                if (
                    (!province.value && postal.value) ||
                    (province.value && !postal.value)
                ) {
                    setAreaError(false);
                }
            });
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

            data.selectedAgeGroups = selectedAgeGroups;
            data.eligibilityGroups = selectedEligibilityGroups;
            data.province = province.value === "All" ? "CA" : province.value;

            if (auth.user.admin) {
                auth.postMessage(data);
                sendTargettedMessages(data);
                setPending(false);
                reset();
                setMessageStatus(true);
            } else {
                alert("Only admins can post messages");
            }
        }
    };

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />
                <Form onSubmit={handleSubmit(onSubmit)}>
                    <Row className="my-4">
                        <Col className="border-right">
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
                                        required: error(
                                            "required",
                                            "message type"
                                        ),
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
                                            message: error(
                                                "invalid",
                                                "link to booking"
                                            ),
                                        },
                                    })}
                                />
                            </Form.Group>
                            <Form.Group controlId="numberToBooking">
                                <FormField
                                    name="numberToBooking"
                                    type="tel"
                                    label="Phone Number to Booking"
                                    placeholder="000-000-000"
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
                        <Col className="pl-4">
                            <h2 className="selectGroupText">
                                Select a province OR enter the first 3 digits of
                                the postal codes that this message is relevant
                                for.
                            </h2>
                            <Form.Row className="m-0 justify-content-between">
                                <Col className="p-0 pr-2">
                                    <Form.Label className="mb-1">
                                        Postal Code
                                    </Form.Label>
                                    {[...Array(numPostals)].map(() => (
                                        <Form.Group controlId="formPostal">
                                            <FormField
                                                name="postal"
                                                style={{
                                                    textTransform: "uppercase",
                                                }}
                                                error={errors.postal}
                                                placeholder="A0A"
                                                className="postalCodesInput"
                                                inputRef={register({
                                                    pattern: {
                                                        value: /[ABCEGHJ-NPRSTVXY][0-9][ABCEGHJ-NPRSTV-Z]$/gi,
                                                        message:
                                                            "Please enter 3 characters of a postal code",
                                                    },
                                                })}
                                            />
                                        </Form.Group>
                                    ))}
                                    <Form.Text muted>
                                        Add up to 10 postal codes
                                    </Form.Text>
                                    <Button
                                        variant="link"
                                        className="px-0"
                                        onClick={() =>
                                            setNumPostals(
                                                numPostals < 10
                                                    ? numPostals + 1
                                                    : numPostals
                                            )
                                        }
                                    >
                                        Add another postal code
                                    </Button>
                                </Col>
                                <Col className="p-0">
                                    <Form.Group controlId="province">
                                        <FormField
                                            name="province"
                                            className="province"
                                            type="select"
                                            options={provincesWAll}
                                            defaultValue="--"
                                            label="Province"
                                            error={errors.province}
                                        />
                                    </Form.Group>
                                </Col>
                                {areaError && (
                                    <Form.Control.Feedback className="text-left groupError">
                                        {error("areaError")}
                                    </Form.Control.Feedback>
                                )}
                            </Form.Row>
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

                    {messageStatus && (
                        <Form.Control.Feedback className="text-center groupSuccess">
                            Message Sent
                        </Form.Control.Feedback>
                    )}

                    <Button
                        variant="primary"
                        block={true}
                        size="lg"
                        type="submit"
                        disabled={pending}
                    >
                        Submit Message
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
            </Container>
        </Section>
    );
}

export default PostsSection;
