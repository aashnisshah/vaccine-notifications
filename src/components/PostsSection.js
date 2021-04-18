import React from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import FormField from "./FormField";
import {Form} from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import UserPreferences from "./UserPreferences";
import { Link, useRouter } from "./../util/router.js";

import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";

function PostsSection(props) {
  const auth = useAuth();
  const router = useRouter();
  
  const { handleSubmit, register, errors, getValues } = useForm();

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
          <Form.Group controlId="phoneNumber">
            <FormField
              name="phoneNumber"
              type="tel"
              label="Phone Number"
              placeholder="000-000-000"
              // error={errors.phoneNumber}
              inputRef={register({
                required: "oops",
              })}
            />
            <h5>SELECT GROUPS TO SEND MESSAGES TO?</h5>
            <FormField
              name="phoneNumber"
              type="text"
              label="Message Title"
              // error={errors.phoneNumber}
              inputRef={register({
                required: "oops",
              })}
            />
            <FormField
              name="phoneNumber"
              type="text"
              as="textarea"
              label="Message Body"
              // error={errors.phoneNumber}
              inputRef={register({
                required: "oops",
              })}
            />
            <FormField
              name="phoneNumber"
              type="textarea"
              label="Message Footer"
              defaultValue="Type STOP at any time to unsubscribe from all notifications. To update your preferences please visit _______"
              inputRef={register({
                required: "oops",
              })}
            />
          </Form.Group>
      </Container>
    </Section>
  );
}

export default PostsSection;
