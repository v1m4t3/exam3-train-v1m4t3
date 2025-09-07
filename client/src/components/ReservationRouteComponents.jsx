import { Container, Row, Col, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { TrainCard } from './TrainCardComponent.jsx';
import { useEffect, useState } from 'react';
import TrainAPI from '../API/TrainAPI.js';

function ReservationRoute(props) {   // former Main component

  // ROUTES 
  // /  = initial page  (list of answers)
  // /add = show the form needed to add a new answer
  // /edit/:id  = show the form to edit an answer  (identified by :id)



  const navigate = useNavigate();


  return ( 
    <Container fluid>
      <div className="text-center my-4"/>

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

     

      {props.initialLoading ? (
        <div className="text-center my-4">
          <div>Loading available trains...</div>
          <div><i className="bi bi-train-front-fill" style={{ fontSize: '2rem', color: '#6c63ff' }}></i></div>
        </div>
      ):
        props.errorMsg ?(
          <div className="text-center my-4">
            <div className="alert alert-danger" role="alert">
              {props.errorMsg}
            </div>
          </div>
      ):(
          props.listOfTrains.map((train, index) => (
            <TrainCard key={index} train={train} />
          )))}

    </Container>
  );
}
export { ReservationRoute };