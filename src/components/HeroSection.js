import React, { useState, useEffect } from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import SectionHeader from "./SectionHeader";
import Image from "react-bootstrap/Image";
import "./HeroSection.scss";
import DownloadButtons from "./DownloadButtons";

function HeroSection(props) {
    const [isMobile, setIsMobile] = useState(false);
  
    useEffect(() => {
        if (/Mobi|Android/i.test(navigator.userAgent) && localStorage.getItem("ExpoToken")) {
        setIsMobile(true);
        }
    }, [])
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

                        {!isMobile &&<DownloadButtons />}
                    </Col>
                    <Col className="offset-lg-1 mt-5 mt-lg-0 ">
                        <figure className="HeroSection__image-container mx-auto">
                            <Image
                                src={props.image}
                                alt={props.imageAlt}
                                fluid={true}
                            />
                        </figure>
                    </Col>
                </Row>
            </Container>
        </Section>
    );
}

export default HeroSection;
