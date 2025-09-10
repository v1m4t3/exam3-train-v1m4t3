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

function RightSide(props) {
    const { newReservation, setNewReservation, 
            user, loggedIn, loggedInTotp, 
            listOfTrains, initialLoading, errorMsg, setErrorMsg, 
            reservationDetails, setReservationDetails } = props;

    return (
       <>
        {reservationDetails && !newReservation ? (
          <TicketCardDetails ticket={reservationDetails} />
        ): null}
        {/* {newReservation && loggedIn ? (
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
) : null} */}

       
       </> 

    );
}

function TicketCardDetails(props) {
    const { ticket } = props;
    const seatCount = ticket.seats.length;
    const columns = seatCount === 45 ? 3 : seatCount > 45 ? 4 : 2; 

    return (
        <Card className="ticket-card-details">
      <Card.Body>
        {/* Data */}
        <Row>

        <div className="d-flex justify-content-between">
          <span> 
            <span className="ticket-id">
              TICKET #{ticket.reservationId}  
            </span>
            <span className="ticket-date-buy" > 
                (Buyed: {dayjs(ticket.trainDate).format('DD MMMM YYYY')})
            </span>
          </span> 
          <span className='ticket-id'>{ticket.totalPrice} €</span>

       </div>
        <hr style={{ borderTop: '3px solid #ccc', margin: '1rem 0' }} />

        
        </Row>
        
        {/* Contenuto principale */}
        <Row fontSize="small" className="text-center align-items-center pt-4">

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


        <div className="text-left mb-3 pt-5">
            <span className='fw-bold fs-7'> {capitalizeWords(ticket.carName)}:  </span>

            <span className='fw-bold fs-7 ms-4'> {ticket.purpleSeats} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by you in this reservation"}</Tooltip>}>
              <span><SeatIconSmall className="seat-indigo-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {ticket.orangeSeats} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by you in another reservation"}</Tooltip>}>
              <span><SeatIconSmall className="seat-orange-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {ticket.redSeats} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by others"}</Tooltip>}>
              <span><SeatIconSmall className="seat-red-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {ticket.greenSeats} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Available seat"}</Tooltip>}>
              <span><SeatIconSmall className="seat-green-icon" /></span>
            </OverlayTrigger>

        </div> 
        <div className='text-start mx-3 mt-1'>        
          <span className='fw-bold fs-9'>Total Seats:</span>
          <span className='fw-bold fs-7 ms-2'>{ticket.seats.length}</span>
        </div> 

        <div className="page mt-5">
          <TrainCar seatsInfo={ticket.seats} columns={columns} />
        </div>
        </Card.Body>
    </Card>
    );
}


function groupSeatsByRow(seats) {
  const rows = {};
  seats.forEach((s) => {
    const match = s.seatNumber.match(/^(\d+)([A-Z])$/);
    if (!match) return;
    const row = match[1];
    rows[row] = rows[row] || [];
    rows[row].push(s);
  });

  // ordina lettere
  Object.keys(rows).forEach((r) => {
    rows[r].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber));
  });

  return rows;
}

function seatStatusToColor(status) {
  switch (status) {
    case 'purple':
      return 'Occupied by you in this reservation'; // indigo
    case 'orange':
      return 'Occupied by you in another reservation'; // orange
    case 'red':
      return 'Occupied by others'; // red
    case 'green':
      return 'Available seat'; // green
    case 'yellow':
      return 'Selected seat'; // yellow
    default:
      return 'Status unknown'; // default gray
  }
}


function Seat({ seat }) {

  const popover = (
    <Popover id={`popover-seat-${seat.seatId}`}>
      <Popover.Body className="text-center">
        <strong>{seat.seatNumber}</strong>
        <br />
        Seat Price: {seat.seatPrice} €
        <br />
        <br />
        {seatStatusToColor(seat.seatStatus)}
      </Popover.Body>
    </Popover>
  );
  
  return (
    <OverlayTrigger
      placement="top"
      overlay={popover}
      trigger={['hover', 'focus']}
      delay={{ show: 200, hide: 200 }}
    >

  
      <div className="seat-container" >
        <SeatIcon className={`seat-${seat.seatStatus === 'purple' ? 'indigo' : seat.seatStatus}-icon`} />
      </div>

    </OverlayTrigger>
  );
}

function TrainCar({ seatsInfo, columns }) {
  const rows = groupSeatsByRow(seatsInfo);

  return (
    <div className="train-car train-car-size">

      {Object.entries(rows).map(([rowNumber, rowSeats]) => (
        <div className={`train-row-${columns}`} key={rowNumber}>
          <div className="train-row-label">{rowNumber}</div>

          {/* sedili lato sinistro */}
          {rowSeats.slice(0, Math.floor(columns / 2)).map((s) => (
            <Seat key={s.seatId} seat={s} />
          ))}

          {/* corridoio */}
          <div className="train-aisle" />

          {/* sedili lato destro */}
          {rowSeats.slice(Math.floor(columns / 2)).map((s) => (
            <Seat key={s.seatId} seat={s} />
          ))}

          <div className="train-row-label">{rowNumber}</div>
        </div>
      ))}
    </div>
  );
}

export { RightSide };
