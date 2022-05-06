import FeatherIcon from "feather-icons-react";
import React from "react";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { useContext } from "react";
import { LoginContext } from "./App";

export default function SignInForm() {
  const { handleLoginChange, confirmSignUp, updateLoginState, loginState } =
  useContext(LoginContext);
  console.log("val", updateLoginState);

  return (
    <>
      <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
        <Container>
          <Row className="justify-content-center">
            <Col xs={12} md={5} xl={4} className="my-5">
              <h1 className="display-4 text-center mb-3">Sign in</h1>
              <p className="text-muted text-center mb-5">
                Free access to our dashboard.
              </p>
              <form>
                <div className="form-group">
                  <Form.Label>Auth code</Form.Label>
                  <Form.Control
                    name="authCode"
                    type="text"
                    placeholder="name"
                    onChange={handleLoginChange}
                  />
                </div>

                <Button
                  size="lg"
                  className="w-100 mb-3"
                  onClick={confirmSignUp}
                >
                  Confirm
                </Button>
              </form>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}
