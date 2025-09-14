import { useState } from 'react';
import '../styles/LeftPage.css';
import '../styles/TicketCard.css';
import dayjs from 'dayjs';
import { capitalizeWords } from '../utils.js';
import SeatIconSmall from '../assets/icons/seatIconSmall.svg?react';
import { Button, Card, Col, Row, OverlayTrigger, Tooltip, Alert} from 'react-bootstrap';
import DottedLineWithEnds from './UtilsComponents.jsx';
import TicketAPI from '../API/TicketAPI.js';

function LeftSide(props) {
    const { newReservation, setNewReservation, listOfReservations, selectedReservation, setSelectedReservation, setDirty } = props;

    return (
       <>
        <Button className={`btn-new-reservation ${newReservation ? "selected" : ""}`} variant="warning" size="lg" 
                onClick={() => {setNewReservation(true);
                                setSelectedReservation(null);
                            }}> 
          <span className="fs-5">New Reservation  </span>
          <i className="bi bi-ticket-perforated-fill fs-4"></i> 
        </Button>

        {listOfReservations.length === 0 ? (
         <div className="d-flex justify-content-center align-items-center flex-column p-4">
            <Alert variant="dark" className="text-center w-100">
                <h5 className="mb-3">It looks like you haven't booked any train tickets yet.</h5>
                <p>Click the button above to make your first reservation.</p>
            </Alert>
          </div>
        ) : listOfReservations.map((reservation) => (
          <TicketCard key={reservation.reservationId} ticket={reservation} 
                      selectedReservation={selectedReservation} setSelectedReservation={setSelectedReservation} 
                      newReservation={newReservation} setNewReservation={setNewReservation} 
                      setDirty={setDirty} />
        ))}

    </>
    );
}







function TicketCard(props) {
    const { ticket, selectedReservation, setSelectedReservation, newReservation, setNewReservation, setDirty } = props;
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteReservation = (reservationId) => {
      // Call the API to delete the reservation
      TicketAPI.deleteReservationById(reservationId)
          .then(() => {
              // If successful, update the state to remove the reservation
              newReservation ? setNewReservation(false) : setNewReservation(true);
              setSelectedReservation(null);
              setDirty(true);
          })
          .catch((error) => {
              console.error("Error deleting reservation:", error);
          });
      }; 

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
                (Buyed: {dayjs(ticket.dateIssued).format('DD MMMM YYYY')})
            </span>

       </span> 

            <i className="bi bi-trash3-fill ticket-delete-icon ticket-id" role="button" title="Delete Ticket"
                onClick={() => handleDeleteReservation(ticket.reservationId)}
            ></i>
       </div>
        <hr style={{ borderTop: '3px solid #ccc', margin: '1rem 0' }} />
        

        </Row>
        <div className="text-left mb-3">
            <span className='fw-bold fs-7'> {capitalizeWords(ticket.carName)}: {ticket.seatCount}  </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by you in this reservation"}</Tooltip>}>
              <span><SeatIconSmall className="seat-purple-icon" /></span>
            </OverlayTrigger>
        </div>
        {/* Contenuto principale */}
        <Row fontSize="small" className="text-center align-items-center">

          <Col>
            <div className="station-name">{ticket.departureStation}</div>
            <div className="station-code">{ticket.departureStation.slice(0,3).toUpperCase()}</div>
            
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