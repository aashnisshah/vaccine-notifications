import React from "react";
import Section from "./Section";
import { Container }from "react-bootstrap";
import SectionHeader from "./SectionHeader";
import "./DownloadSection.scss";

function UpdatesSection(props) {
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
          size={2}
          spaced={true}
          className="text-center"
        />
        <Container className="textContainer">{props.subtitle}</Container>
      </Container>
    </Section>
  );
}

export default UpdatesSection;
