import { Col, Container, Row } from 'react-bootstrap';
import  files  from './data/files';
import ProjectHeader  from './ProjectHeader';
import Files from "./Files"

export default function ProjectFiles() {
  return (
    <div className="main-content">
      <ProjectHeader />
      <Container fluid>
        <Row>
          <Col xs={12}>
            <Files files={files} />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
