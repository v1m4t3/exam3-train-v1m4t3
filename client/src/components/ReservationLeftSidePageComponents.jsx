import { useState } from 'react';
import '../styles/LeftPage.css';
import '../styles/TicketCard.css';
import dayjs from 'dayjs';
import { capitalizeWords } from '../utils.js';
import SeatIconSmall from '../assets/icons/seatIconSmall.svg?react';
import { Button, Card, Col, Row} from 'react-bootstrap';
import DottedLineWithEnds from './UtilsComponents.jsx';


function LeftSide(props) {
    const { newReservation, setNewReservation, listOfReservations, selectedReservation, setSelectedReservation } = props;

    return (
       <>
        <Button className={`btn-new-reservation ${newReservation ? "selected" : ""}`} variant="warning" size="lg" 
                onClick={() => setNewReservation(true)}>
          <span className="fs-5">New Reservation  </span>
          <i className="bi bi-ticket-perforated-fill fs-4"></i> 
        </Button>

        {listOfReservations.map((reservation) => (
          <TicketCard key={reservation.reservationId} ticket={reservation} selectedReservation={selectedReservation} setSelectedReservation={setSelectedReservation} newReservation={newReservation} setNewReservation={setNewReservation} />
        ))}

    </>
    );
}



function TicketCard(props) {
    const { ticket, selectedReservation, setSelectedReservation, newReservation, setNewReservation } = props;

    return (
        //check if the ticket is the selected one and apply a different style
      <Card className={`ticket-card ${selectedReservation?.reservationId === ticket.reservationId ? 'ticket-card-selected' : ''}`}>
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
          <Button
            className={`ticket-see-details-btn ${selectedReservation?.reservationId === ticket.reservationId ? 'selected' : ''}`}
            onClick={() => {
              setSelectedReservation(ticket);
              setNewReservation(false);
              console.log("Proceed clicked on ticket " + ticket.reservationId)
            }}>
            SEE DETAILS
          </Button>
        </div> 

        </Card.Body>
    </Card>
    );
}

export { LeftSide};