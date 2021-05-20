import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "./FeaturesSection.scss";
import getNotificationsImage from "./../images/email-campaign-rafiki.svg";
import preferencesImage from "./../images/preferences-amico.svg";
import phoneImage from "./../images/mobile-login-pana.svg";
import vaccineImage from "./../images/vaccine-bro.svg";
import DownloadButtons from "./DownloadButtons";

function FeaturesSection(props) {
    const items = [
        {
            title: "Create an Account",
            description: "Create an account so we know how to reach you",
            image: phoneImage,
            alt: "image of person verifying login credentials",
        },
        {
            title: "Set Your Notification Preferences",
            description:
                "Select which updates you want to receive based on your eligibility groups and postal code",
            image: preferencesImage,
            alt: "image of person toggling phone preferences",
        },
        {
            title: "Get Notifications",
            description:
                "Receive vaccine notifications and updates by either downloading our App or accepting browser notifications",
            image: getNotificationsImage,
            alt: "image of person with a loudspeaker next to a phone",
        },
        {
            title: "Get the Vaccine",
            description:
                "Follow the link or call the number in the notification to book your vaccine appointment",
            image: vaccineImage,
            alt: "image of a person receiving a COVID-19 vaccine",
        },
    ];

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container className="mt-4">
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={2}
                    spaced={true}
                    className="text-center"
                />
                {!props.isMobile && <DownloadButtons />}
                <div className="FeaturesSection__features">
                    {items.map((item, index) => (
                        <Row className="align-items-center" key={index}>
                            <Col xs={12} lg={6}>
                                <SectionHeader
                                    title={item.title}
                                    subtitle={item.description}
                                    spaced={true}
                                    size={3}
                                    className="text-center text-lg-left"
                                />
                            </Col>
                            <Col>
                                <figure className="FeaturesSection__image-container">
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        fluid={true}
                                    />
                                </figure>
                            </Col>
                        </Row>
                    ))}
                </div>
            </Container>
            <div className="text-center">
                <a href="https://storyset.com/device">
                    Illustrations by Freepik Storyset
                </a>
            </div>
        </Section>
    );
}

export default FeaturesSection;
