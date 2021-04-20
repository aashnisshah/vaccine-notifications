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

function FeaturesSection(props) {
  const items = [
    {
      title: "Verify Your Phone Number",
      description: "",
      image: phoneImage,
      alt: "image of person verifying login credentials",
    },
    {
      title: "Set Your Notification Preferences",
      description:
        "Let us know a few details like your postal code so we can send you relevant information",
      image: preferencesImage,
      alt: "image of person toggling phone preferences",
    },
    {
      title: "Get notifications",
      description:
        "Receive text notifications relevant to you straight to your phone",
      image: getNotificationsImage,
      alt: "image of person with a loudspeaker next to a phone",
    },
    {
      title: "Get the vaccine",
      description:
        "Sign up to receive the vaccine once it becomes available to you",
      image: vaccineImage,
      alt: "image of a person receiving a COVID-19 vaccine",
    }
  ];

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
          size={2}
          spaced={true}
          className="text-center"
        />
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
                  <Image src={item.image} alt={item.alt} fluid={true} />
                </figure>
              </Col>
            </Row>
          ))}
        </div>
      </Container>
    </Section>
  );
}

export default FeaturesSection;
