import React from 'react';
import { Button, Card, Container, Row, Col, ListGroup } from "react-bootstrap";
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

function ReservationsRoute(props) {
  const { user, loggedIn, loggedInTotp, listOfTrains, initialLoading, errorMsg, setErrorMsg } = props;

  const [newReservation, setNewReservation] = useState(false);
  const [listOfReservations, setListOfReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
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
    }
  }, [newReservation, setErrorMsg]);

    return (
        
        <Container fluid className="vh-100">
      <Row className="h-100">
        {/* Sidebar sinistra */}
        <Col md={4} className="border-end bg-light p-3 d-flex flex-column">

          <LeftSide newReservation={newReservation} setNewReservation={setNewReservation}
                    user={user} loggedIn={loggedIn} loggedInTotp={loggedInTotp}
                    listOfReservations={listOfReservations} />
          
        </Col>

        {/* Parte destra */}
        <Col md={8} className="p-4">
          <Row xs={1} md={3} className="g-4">
            <RightSide newReservation={newReservation} setNewReservation={setNewReservation} 
                       user={user} loggedIn={loggedIn} loggedInTotp={loggedInTotp}
                       listOfTrains={listOfTrains} initialLoading={initialLoading} errorMsg={errorMsg} setErrorMsg={setErrorMsg}/>
            
            
          </Row>
        </Col>
      </Row>
    </Container>

    );
} 

export { ReservationsRoute };

function LeftSide(props) {
    const { newReservation, setNewReservation, listOfReservations } = props;

    return (
       <>
        <Button className={`btn-new-reservation ${newReservation ? "selected" : ""}`} variant="warning" size="lg" 
                onClick={() => setNewReservation(!newReservation)}>
          <span className="fs-5">New Reservation  </span>
          <i className="bi bi-ticket-perforated-fill fs-4"></i> 
        </Button>

        {listOfReservations.map((reservation) => (
          <TicketCard key={reservation.reservationId} ticket={reservation} />
        ))}

    





    </>
    );
}



function TicketCard(props) {
    const { ticket } = props;
    
    
    return (
        <Card className="ticket-card">
      <Card.Body>
        {/* Data */}
        <Row>

        <div className="ticket-header">
            <span> 
        <span className="ticket-id">
          TICKET #{ticket.reservationId}  
        </span>
            <span className="ticket-date-buy" > 
                (Buyed: {dayjs(ticket.trainDate).format('DD MMMM YYYY')})
            </span>

       </span> 

            <i className="bi bi-trash3-fill ticket-delete-icon ticket-id" role="button" title="Delete Ticket"
                onClick={() => console.log("Delete clicked")} // <-- tua funzione
            ></i>
       </div>
        <hr style={{ borderTop: '3px solid #ccc', margin: '1rem 0' }} />

        
        </Row>
        <div className="text-left mb-3">
            <span className='fw-bold fs-7'> {capitalizeWords(ticket.carName)}: {ticket.seatCount}  </span>
            <SeatIconSmall className="seat-indigo-icon" />
        </div>
        {/* Contenuto principale */}
        <Row fontSize="small" className="text-center align-items-center">

          <Col>
            <div className="station-name">{ticket.departureStation}</div>
            <div className="station-code">{ticket.departureStation.slice(0,3).toUpperCase()}</div>
            
            {/* <div className="time">{train.departureTime.format('HH:mm')}</div> */}
            <div className="time">{dayjs(ticket.departureTime).format('HH:mm')}</div>      
            </Col>

          {/* Treno e durata */}
          <Col>
            <div className="train-number">{ticket.trainNumber}</div>
            <DottedLineWithEnds />
            <div className="duration">{ticket.duration}</div>
          </Col>

          {/* Arrivo */}
          <Col>
            <div className="station-name">{ticket.arrivalStation}</div>
            <div className="station-code">{ticket.arrivalStation.slice(0,3).toUpperCase()}</div>
            <div className="time">{dayjs(ticket.arrivalTime).format('HH:mm')}</div>
          </Col>
        </Row>

        <div className="text-end mt-4">
          <Button className="proceed-btn" onClick={() => console.log("Proceed clicked")}>
            SEE DETAILS
          </Button>
        </div> 

        </Card.Body>
    </Card>
    );
}






function RightSide(props) {
    const { newReservation, setNewReservation, user, loggedIn, loggedInTotp, listOfTrains, initialLoading, errorMsg, setErrorMsg } = props;

    return (
       <>
        {newReservation && loggedIn ? (
  <Container className="train-list">
    {props.initialLoading ? (
      <div className="text-center my-4">
        <div>Loading available trains...</div>
        <div>
          <i
            className="bi bi-train-front-fill"
            style={{ fontSize: '2rem', color: '#6c63ff' }}
          ></i>
        </div>
      </div>
    ) : props.errorMsg ? (
      <div className="text-center my-4">
        <div className="alert alert-danger" role="alert">
          {props.errorMsg}
        </div>
      </div>
    ) : (
      props.listOfTrains.map((train, index) => (
        <TrainCard key={index} train={train} />
      ))
    )}
  </Container>
) : null}

       
       </> 

    );
}

function DottedLineWithEnds() {
  return (
    <div className="dotted-line-container">
      <div className="dot-end"></div>
      <div className="separator"></div>
      <div className="circle-center"></div>
      <div className="separator"></div>
      <div className="dot-end"></div>
    </div>
  );
}

// export default function TicketRate(props) {
//   const [tickets, setTickets] = useState([]);

//   const handleNewReservation = () => {
//     const newId = tickets.length + 1;
//     setTickets([...tickets, { id: newId }]);
//   };

//   return (
//     <Container fluid className="vh-100">
//       <Row className="h-100">
//         {/* Sidebar sinistra */}
//         <Col md={4} className="border-end bg-light p-3 d-flex flex-column">

//           <LeftSide newReservation={false} setNewReservation={() => {}} />
//           <ListGroup>
//             {tickets.map((t) => (
//               <ListGroup.Item
//                 key={t.id}
//                 action
//                 className="mb-2 rounded"
//               >
//                 Ticket #{t.id}
//               </ListGroup.Item>
//             ))}
//           </ListGroup>
//         </Col>

//         {/* Parte destra */}
//         <Col md={8} className="p-4">
//           <Row xs={1} md={3} className="g-4">
//             <Col>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body className="d-flex align-items-center justify-content-center text-muted">
//                   Card vuota 1
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body className="d-flex align-items-center justify-content-center text-muted">
//                   Card vuota 2
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col>
//               <Card className="h-100 shadow-sm">
//                 <Card.Body className="d-flex align-items-center justify-content-center text-muted">
//                   Card vuota 3
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//         </Col>
//       </Row>
//     </Container>
//   );
// }