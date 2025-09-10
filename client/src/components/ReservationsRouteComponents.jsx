import { useState } from 'react';
// import '../styles/ReservationPage.css';
import '../styles/LeftPage.css';
import '../styles/TicketCard.css';
import { useEffect } from 'react';
import { TrainCard } from './TrainCardComponent.jsx';
import  TicketAPI  from '../API/TicketAPI.js';
import { Ticket } from '../Models/TicketModels.js'
import dayjs from 'dayjs';
import { capitalizeWords } from '../utils.js';
import SeatIconSmall from '../assets/icons/seatIconSmall.svg?react';
import SeatIcon from '../assets/icons/seatIcon.svg?react';
import { Button, Card, Col, Container, OverlayTrigger, Popover, Row, Tooltip } from 'react-bootstrap';
import DottedLineWithEnds from './UtilsComponents.jsx';
import { LeftSide } from './ReservationLeftSidePageComponents.jsx';
import { RightSide } from './ReservationRightSidePageComponents.jsx';

function ReservationsRoute(props) {
  const { user, loggedIn, loggedInTotp, listOfTrains, initialLoading, errorMsg, setErrorMsg } = props;

  const [newReservation, setNewReservation] = useState(true);
  const [listOfReservations, setListOfReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [reservationDetails, setReservationDetails] = useState(null);
  // const [selectedTrain, setSelectedTrain] = useState(null);
  const [dirty, setDirty] = useState(true);
  useEffect(() => {
    if (dirty) {
    TicketAPI.getUserReservations()
        .then((reservations) => {
            console.log('Fetched reservations:', reservations);
            setListOfReservations(reservations);
            console.log('List of reservations updated:', listOfReservations);
            setDirty(false);
        })
        .catch((error) => {
            console.error('Error fetching reservations:', error);
        });
    }
}, [dirty]);

  useEffect(() => {
    if (newReservation) {
      console.log('Starting a new reservation'); // Clear any previous error messages when starting a new reservation
    }else if (selectedReservation) {
      console.log('Fetching details for reservation ID:', selectedReservation.reservationId);
      TicketAPI.getReservationById(selectedReservation.reservationId)
        .then((details) => {
          console.log('Fetched reservation details:', details);
          setReservationDetails(details);
        })
        .catch((error) => {
          console.error('Error fetching reservation details:', error);
          setErrorMsg('Error fetching reservation details: ' + error);
        });
    }
  }, [newReservation, selectedReservation, setErrorMsg]);

    return (
        
        <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Sidebar sinistra */}
        <Col md={4} className="border-end bg-light p-3 d-flex flex-column">

          <LeftSide newReservation={newReservation} setNewReservation={setNewReservation}
                    user={user} loggedIn={loggedIn} loggedInTotp={loggedInTotp}
                    listOfReservations={listOfReservations} selectedReservation={selectedReservation} setSelectedReservation={setSelectedReservation} />
          
        </Col>

        {/* Parte destra */}
        <Col md={8} className="p-4">
          <Row xs={1} md={3} className="g-4">
            <RightSide newReservation={newReservation} setNewReservation={setNewReservation} 
                       user={user} loggedIn={loggedIn} loggedInTotp={loggedInTotp}
                       listOfTrains={listOfTrains} initialLoading={initialLoading} errorMsg={errorMsg} setErrorMsg={setErrorMsg}
                       reservationDetails={reservationDetails} setReservationDetails={setReservationDetails} />
            
            
          </Row>
        </Col>
      </Row>
    </Container>

    );
} 

export { ReservationsRoute };







