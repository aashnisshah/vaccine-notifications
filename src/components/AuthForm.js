import React, { useState } from "react";
import { Row, Col, Form, Button, Container } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useAuth } from "./../util/auth.js";

function AuthForm(props) {
  const { onAuth } = props;
  const auth = useAuth();

  const [pending, setPending] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [state, setState] = useState({
    phoneNumber: "",
    otp: "",
  })
  
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setState({...state, [name]: value });
  };

  const requestOTPCode = async (e) => {
    e.preventDefault();
    setPending(true);
    auth.setUpRecaptcha();
    const otpRequestSent = await auth.requestOTPCode(state.phoneNumber);
    setPending(false);
    if (otpRequestSent) {
      setShowOTP(true);
    } 
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault();
    setPending(true);
    let otpInput = state.otp;
    const userData = {
      postalCode: "L3Z 2F4",
      province: "ON"
    }
    const success = await auth.submitOTPCode(otpInput, userData);
    setPending(false)
    if (success) {
      onAuth();
    }
  };

  return (
    <div>
        <Container fluid="sm" className="mt-3">
            <Row className="justify-content-center" style={{display: showOTP ? "none": null }}>
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
                  <Button variant="primary" type="submit">
                    {!pending && <span>Get Verification Code</span>}
                    {pending && (
                      <>
                        <Spinner
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden={true}
                          className="align-baseline mr-1"
                        >
                        </Spinner>
                        <span>Loading...</span>
                      </>
                    )}
                  </Button>
                </Form>
              </Col>
            </Row>
          {showOTP && 
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
                  <Button variant="primary" type="submit">
                    {!pending && <span>Submit</span>}
                      {pending && (
                        <>
                          <Spinner
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden={true}
                            className="align-baseline mr-1"
                          >
                          </Spinner>
                          <span>Loading...</span>
                        </>
                      )}
                  </Button>
                  <Button variant="secondary" onClick={()=>setShowOTP(false)}>Go Back</Button>
                </Form>
              </Col>
            </Row>
          }
          {!showOTP && <div id="recaptcha-container"></div>}
        </Container>
      </div>
  );
}

export default AuthForm;
