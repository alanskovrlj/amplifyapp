import FeatherIcon from "feather-icons-react";
import React from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { useContext } from "react";
import { LoginContext } from "./App";

export default function SignInForm() {
  const { handleLoginChange, confirmSignUp, updateLoginState, loginState } =
    useContext(LoginContext);
  console.log("val", updateLoginState);

  return (
    <>
      <h1 className="display-4 text-center mb-3">Sign in</h1>
      <p className="text-muted text-center mb-5">
        Free access to our dashboard.
      </p>
      <form>
        <div className="form-group">
          <Form.Label>Auth code</Form.Label>
          <Form.Control
            type="text"
            placeholder="name"
            onChange={handleLoginChange}
          />
        </div>

        <Button size="lg" className="w-100 mb-3" onClick={confirmSignUp}>
          Confirm
        </Button>
      </form>
    </>
  );
}
