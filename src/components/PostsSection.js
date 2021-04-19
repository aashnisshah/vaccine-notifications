import React, { useState } from "react";
import { Container, Form, Spinner, Button, Row, Col } from "react-bootstrap";
import { Link, useRouter } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { ageGroups, eligibilityGroups, provinces, error, selectAll } from "./formConstants";

function PostsSection(props) {
  const auth = useAuth();
  const router = useRouter();
  const { handleSubmit, register, errors } = useForm();

  const [pending, setPending] = useState(false);
  const [groupError, setGroupError] = useState(false); 

  let accountConfigured = auth.user.phone && auth.user.province && auth.user.postalcode;

  const onSubmit = (data) => {
    if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
      setGroupError(true);
      const allCheckBoxes = document.querySelectorAll('input[type="checkbox"]');
      for (let i = 0; i < allCheckBoxes.length; i++) {
        allCheckBoxes[i].addEventListener("click", function() {
          setGroupError(!this.checked)
        });
      }
    } else {
      setGroupError(false);
      setPending(true);

      const selectedAgeGroups = [];
      const selectedEligibilityGroups = [];
  
      const allSelectedGroups = document.querySelectorAll('input[type="checkbox"]:checked')
      allSelectedGroups.forEach((group) => {
        if (ageGroups.includes(group.id)) {
          selectedAgeGroups.push(group.id);
        } else if (eligibilityGroups.includes(group.id)) {
          selectedEligibilityGroups.push(group.id);
        }
      })
  
      data.selectedAgeGroups = selectedAgeGroups;
      data.eligibilityGroups = selectedEligibilityGroups;
      data.postal = data.postal.replace(/\s/g, "").toUpperCase();
    }
  }

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
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Row className="my-4">
            <Col lg={7} className="border-right">
              <div className="my-4">
                <h2 className="selectGroupText">Select all age groups that this message is relevant to.</h2>
                <Form.Row controlId="ageGroup" className="mx-0">
                  {ageGroups.map((ageGroup) => (
                    <div key={ageGroup} >
                      <Form.Check 
                        className="mr-3 ageGroupField"
                        type="checkbox"
                        id={ageGroup}
                        label={ageGroup}
                      />
                    </div>
                  ))}
                </Form.Row>
                <Button onClick={() => selectAll("ageGroupField")} variant="link" className="p-0">Select all</Button>
              </div>
            
              <div className="my-4">
                <h2 className="selectGroupText">Select all eligibility groups that this message is relevant to.</h2>
                <Form.Group controlId="eligibilityGroup" required>
                  {eligibilityGroups.map((eligibilityGroup) => (
                    <div key={eligibilityGroup}>
                      <Form.Check 
                        className="my-2 eligibilityGroupField"
                        type="checkbox"
                        id={eligibilityGroup}
                        label={eligibilityGroup}
                      />
                    </div>
                  ))}
                </Form.Group>
                <Button onClick={() => selectAll("eligibilityGroupField")} variant="link" className="p-0">Select all</Button>
              </div>
            </Col>    
            <Col className="pl-4">
              <Form.Row className="m-0 justify-content-between">
                <Form.Group controlId="messageType" className="mr-2 flex-fill">
                  <FormField
                    name="messageType"
                    type="select"
                    label="Message Type"
                    options={["Placeholder 1", "Placeholder 2", "Placeholder 3"]}
                    error={errors.messageType}
                    inputRef={register({
                      required: error("required", "message type"),
                    })}
                  />
                </Form.Group>
                <Form.Group controlId="province">
                  <FormField
                    name="province"
                    type="select"
                    options={provinces}
                    defaultValue="--"
                    label="Province"
                    error={errors.province}
                    inputRef={register({
                      pattern: {
                        value: /^((?!--).)*$/,
                        message: error("required", "province")
                      }
                    })}
                  />
                </Form.Group>
              </Form.Row>
              <Form.Group controlId="message">
                <FormField
                  name="message"
                  type="textarea"
                  label="Message"
                  placeholder="Provide a short message here."
                  error={errors.message}
                  inputRef={register({
                    required: error("required", "message")
                  })}
                />
              </Form.Group>
              <Form.Group controlId="linkToBooking">
                <FormField
                  name="linkToBooking"
                  label="Link To Booking"
                  error={errors.postal}
                  inputRef={register({
                    pattern: {
                      value: /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
                      message: error("invalid", "link to booking")
                    }
                  })}
                />
              </Form.Group>
              <Form.Group controlId="phoneNumber">
                <FormField
                  name="phoneNumber"
                  type="tel"
                  label="Phone Number to Booking"
                  placeholder="000-000-000"
                  error={errors.phoneNumber}
                  inputRef={register({
                    pattern: {
                      value: /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/,
                      message: error("invalid", "phone number")
                    }
                  })}
                />
              </Form.Group>
              {/* <Form.Group controlId="formPostal">
                <FormField
                  name="postal"
                  label="Postal Code"
                  style={{textTransform: 'uppercase'}}
                  error={errors.postal}
                  placeholder="A0A 0A0"
                  inputRef={register({
                    required: error("required", "postal code"),
                    pattern: {
                      value: /(^[A-Za-z]\d[A-Za-z][ ]?\d[A-Za-z]\d$)|(^\d{5}$)/,
                      message: error("invalid", "postal code")
                    }
                  })}
                /> */}
              {/* </Form.Group> */}
            </Col>
          </Row>

          {groupError && (
            <Form.Control.Feedback className="text-left groupError">
              {error("noGroup")}
            </Form.Control.Feedback>
          )}

          <Button
            variant="primary"
            block={true}
            size="lg"
            type="submit"
            disabled={pending}
          >
            Submit Message
            {pending && (
              <Spinner
                animation="border"
                size="sm"
                role="status"
                aria-hidden={true}
                className="align-baseline"
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </Button>
        </Form>
      </Container>
    </Section>
  );
}

export default PostsSection;
