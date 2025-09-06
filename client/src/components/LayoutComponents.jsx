import { Button } from "bootstrap";
import { Container, Row, Col } from "react-bootstrap";
import { Outlet } from "react-router";
import { NavigationBar } from './NavigationBarComponent.jsx';
import { Footer } from './FooterBarComponents.jsx';
function Layout(props) {

  return (
    <Container fluid>
      <Row>
        <Col>
          <NavigationBar user={props.user} loggedIn={props.loggedIn} logout={props.logout} loggedInTotp={props.loggedInTotp} />
        </Col>
      </Row>
      <Outlet />
      <Row>
        <Col>
          <Footer />
        </Col>
      </Row>
    </Container>
  )
}

export { Layout };