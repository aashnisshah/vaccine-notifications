import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "./../util/auth.js";

function AuthForm(props) {
  const auth = useAuth();

  const [pending, setPending] = useState(false);
  const [state, setState] = useState({
    phoneNumber: "+16473782640",
    otp: "",
  })
  
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setState({...state, [name]: value });
  };


  const requestOTPCode = (e) => {
    e.preventDefault();
    auth.setUpRecaptcha();
    auth.requestOTPCode(state.phoneNumber);
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    let otpInput = state.otp;
    const userData = {
      postalCode: "L3Z 2F4",
      province: "ON"
    }
    const success = await auth.submitOTPCode(otpInput, userData);
    console.log(success);
  };

  return (
    <div>
        <Container fluid="sm" className="mt-3">
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <h2 className="mb-3">Login</h2>
              <Form className="form" onSubmit={requestOTPCode}>
                <Form.Group>
                  <Form.Control
                    type="number"
                    name="mobile"
                    placeholder="Mobile Number"
                    onChange={onChangeHandler}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Get Verification Code</Button>
              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col xs={12} md={6} lg={5}>
              <h2 className="mb-3">Enter OTP</h2>
              <Form className="form" onSubmit={onSubmitOtp}>
                <Form.Group>
                  <Form.Control
                    id="otp"
                    type="number"
                    name="otp"
                    placeholder="OTP"
                    onChange={onChangeHandler}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Submit</Button>
              </Form>
            </Col>
          </Row>
          <div id="recaptcha-container"></div>
        </Container>
      </div>
  );
}

export default AuthForm;
