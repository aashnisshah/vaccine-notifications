import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import Privacy from "./Privacy";
import Tos from "./Tos";

function LegalSection(props) {
    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container
                style={{
                    maxWidth: "850px",
                }}
            >
                {props.pageType === "privacy" && <Privacy />}
                {props.pageType === "tos" && <Tos />}
            </Container>
        </Section>
    );
}

export default LegalSection;
