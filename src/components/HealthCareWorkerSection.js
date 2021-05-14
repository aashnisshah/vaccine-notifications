import React from "react";
import { Container, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import "./HealthCareWorkerSection.scss";

function HealthCareWorkerSection(props) {
  return (
    <Container className="fullContainer">
      <h4>Are you a health care worker?</h4>
      <LinkContainer to="/auth/admin"><Button size="lg">Learn More</Button></LinkContainer>
    </Container> 
  )
};

export default HealthCareWorkerSection;