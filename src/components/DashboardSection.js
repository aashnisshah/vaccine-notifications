import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import UserPreferences from "./UserPreferences";
import { Link, useRouter } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";

function DashboardSection(props) {
  const auth = useAuth();
  const router = useRouter();
  
  let accountConfigured = auth.user.phone && auth.user.province && auth.user.postalcode;


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

        <Row>
          <Col lg={12}>
            {accountConfigured ? `Your account is ready and you'll receive notifications at ${auth.user.phone}` : "Please configure your account below to start receiving text notifications"}
            <UserPreferences />
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardSection;
