import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "./DownloadButtons.scss";

function DownloadButtons(props) {
    const googlePlayLink =
        "https://play.google.com/store/apps/details?id=com.elixirlabs.vaccinenotifications";
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
                    <Col lg={12} className="text-center text-lg-left">
                        <div className="badgesContainer">
                            <a
                                href={googlePlayLink}
                                target="_blank"
                                rel="noreferrer noopener"
                            >
                                <Image
                                    className="badges"
                                    src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                                />
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
                </Row>
            </Container>
        </Section>
    );
}

export default DownloadButtons;
