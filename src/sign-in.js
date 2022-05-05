import { Col, Container, Row } from 'react-bootstrap';
import  SignInForm  from "./SignInForm";
import { useContext } from "react";
import {LoginContext} from "./App"

export default function SignIn() {
   console.log("test");
  return (
    <div className="d-flex align-items-center min-vh-100 bg-auth border-top border-top-2 border-primary">
      <Container>
        <Row className="justify-content-center">
          <Col xs={12} md={5} xl={4} className="my-5">
            <SignInForm />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
