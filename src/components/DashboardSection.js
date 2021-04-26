import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import UpdateNotificationPreference from "./UpdateNotificationPreference";
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

  let accountConfigured = auth.user.phoneNumber && auth.user.province && auth.user.postal;


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
          <Col lg={8}>
            {/* {accountConfigured ? `Your account is ready and you'll receive notifications at the number below.` : "Changing your preferences will change the notifications you receive."} */}
            <UserPreferences newUser={!accountConfigured} />
          </Col>
          <Col lg={4}>
            <UpdateNotificationPreference newUser={!accountConfigured} />
          </Col>
        </Row>
      </Container>
    </Section>
  );
}

export default DashboardSection;
