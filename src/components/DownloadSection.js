import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Image, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { getSendTo } from "../helpers/FormatPostMessage";
import FormAlert from "./FormAlert";
import "./DownloadSection.scss";
import heroImage from "../images/push-notifications-rafiki.png";
import appStoreImage from "../images/app-store-badge.png";

function DownloadSection(props) {    
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
                        <a href={googlePlayLink}>
                          <Image className="badges" src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" />
                        </a>
                        <div>
                          <a className="disabled appStore">
                            Coming soon to the App Store!
                          </a>
                        </div>
                      </div>
                      <LinkContainer to="/">
                        <Button className="worksButton" variant="link">How it works &nbsp; &#8594;</Button>
                      </LinkContainer>
                    </Col>
                    <Col className="offset-lg-1 mt-5 mt-lg-0 ">
                      <figure className="HeroSection__image-container mx-auto">
                        <Image src={heroImage} alt={props.imageAlt} fluid={true} />
                      </figure>
                    </Col>
                  </Row>
                </Container>
        </Section>
    );
}

export default DownloadSection;
