import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import Auth from "./Auth";
import { Row, Col, Image } from "react-bootstrap";
import heroImage from "./../images/homescreen-rafiki.svg";

function AuthSection(props) {
    // Values for each auth type
    const allTypeValues = {
        signin: {
            // Top title
            title: "Sign In",
            // Submit button text
            buttonText: "Sign In",
            // Link text to other auth types
            linkTextSignup: "Create an account",
            // linkTextForgotpass: "Forgot Password?",
        },
        signup: {
            title: "Sign up",
            buttonText: "Sign up",
            linkTextSignin: "Sign in",
        },
        forgotpass: {
            title: "Get a new password",
            buttonText: "Reset password",
        },
        changepass: {
            title: "Choose a new password",
            buttonText: "Change password",
        },
        admin: {
            title: "Sign Up to be an Admin",
            buttonText: "Sign Up",
        },
    };

    // Ensure we have a valid auth type
    const currentType = allTypeValues[props.type] ? props.type : "signup";

    // Get values for current auth type
    const typeValues = allTypeValues[currentType];

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            {props.type === "admin" && (
                <Container className="pb-5 mb-5">
                    <Row className="align-items-center">
                        <Col lg={5} className="text-center text-lg-left">
                            <SectionHeader
                                title="Send Your Own Updates Through Vaccine Notifications"
                                subtitle="If you are an admin managing and deploying vaccines at a hosptial, pharmacy, clinic or pop up, we'd love to partner with you to get more vaccines distributed!"
                                steps={[
                                    "Register for an admin account",
                                    "Wait for your account to be approved",
                                    "When vaccines are available at your location, send targetted notifications out based on location, age and eligibility requirements",
                                ]}
                                size={1}
                                spaced={true}
                            />
                        </Col>
                        <Col className="offset-lg-1 mt-5 mt-lg-0 ">
                            <figure className="HeroSection__image-container mx-auto">
                                <Image src={heroImage} fluid={true} />
                            </figure>
                        </Col>
                    </Row>
                </Container>
            )}

            <Container className="formContainer mt-4">
                <SectionHeader
                    title={allTypeValues[currentType].title}
                    subtitle=""
                    size={2}
                    spaced={true}
                    className="text-center"
                />
                <Auth
                    type={currentType}
                    typeValues={typeValues}
                    providers={props.providers}
                    afterAuthPath={props.afterAuthPath}
                    key={currentType}
                />
            </Container>
        </Section>
    );
}

export default AuthSection;
