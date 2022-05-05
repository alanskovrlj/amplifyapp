import FeatherIcon from 'feather-icons-react';
import React from 'react';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { useContext } from "react";
import { LoginContext } from "./App";

export default function SignInForm() {
  const { handleLoginChange, signIn, updateLoginState, loginState} =
    useContext(LoginContext);
  console.log("val",signIn, updateLoginState);
 
  return (
    <>
      <h1 className="display-4 text-center mb-3">Sign in</h1>
      <p className="text-muted text-center mb-5">
        Free access to our dashboard.
      </p>
      <form>
        <div className="form-group">
          <Form.Label>Username</Form.Label>
          <Form.Control
            name="username"
            type="text"
            placeholder="name"
            onChange={handleLoginChange}
          />
        </div>
        <div className="form-group">
          <Row>
            <Col>
              <Form.Label>Password</Form.Label>
            </Col>
            <Col xs="auto"></Col>
          </Row>
          <InputGroup className="input-group-merge">
            <Form.Control
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleLoginChange}
            />
            <InputGroup.Text>
              <FeatherIcon icon="eye" size="1em" />
            </InputGroup.Text>
          </InputGroup>
        </div>
        <Button size="lg" className="w-100 mb-3" onClick={signIn}>
          Sign in
        </Button>
        <p className="text-center">
          <small className="text-muted text-center">
            Don't have an account yet?{" "}
            <a
              onClick={() => {
                updateLoginState({ ...loginState, formType: "signUp" });
              }}
              style={{ cursor: "Pointer" }}
            >
              Sign up
            </a>
            .
          </small>
        </p>
      </form>
    </>
  );
}

