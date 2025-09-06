import { Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router';

function ReservationRoute(props) {   // former Main component

  // ROUTES 
  // /  = initial page  (list of answers)
  // /add = show the form needed to add a new answer
  // /edit/:id  = show the form to edit an answer  (identified by :id)

  const navigate = useNavigate();


  return ( 
    <Container fluid>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <h2 className="my-2">Welcome to TrainStation!</h2>
        </Col>
      </Row>
      <Row className="justify-content-md-center">
        <Col md="auto">
          <p className="my-2">Your one-stop solution for seamless train ticket reservations. Book your journey with ease and confidence!</p>
        </Col>
      </Row>
    </Container>
  );
}
export { ReservationRoute };