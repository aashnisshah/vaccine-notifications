import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SectionHeader from "./SectionHeader";
import Button from "react-bootstrap/Button";
import { LinkContainer } from "react-router-bootstrap";
import Image from "react-bootstrap/Image";
import "./HeroSection.scss";

function HeroSection(props) {
  const googlePlayLink = "https://play.google.com/store/apps/details?id=com.elixirlabs.vaccinenotifications";
  const appStoreLink = "";

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
    >
      <Container>
        <Row className="align-items-center">
          <Col lg={5} className="text-center text-lg-left">
            <SectionHeader
              title={props.title}
              subtitle={props.subtitle}
              size={1}
              spaced={true}
            />
            
            <div className="badgesContainer">
              <a href={googlePlayLink} target="_blank">
                <Image className="badges" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" />
              </a>
              <div>
                <a className="disabled appStore">
                  Coming soon to the App Store!
                </a>
              </div>
              {/* <LinkContainer to={googlePlayLink} disabled>

                <Image className="badges second" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" />
              </LinkContainer> */}
            </div>
          </Col>
          <Col className="offset-lg-1 mt-5 mt-lg-0 ">
            <figure className="HeroSection__image-container mx-auto">
              <Image src={props.image} alt={props.imageAlt} fluid={true} />
            </figure>
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default HeroSection;
