import { Card, Button, Row, Col, Popover, OverlayTrigger } from 'react-bootstrap';
import '../styles/TrainCard.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { use } from 'react';
import { Train } from '../Models/TrainModels';
import TrainAPI from '../API/TrainAPI.js';
import { capitalizeWords } from '../utils.js';

import { Fragment } from 'react';
import SeatIcon from '../assets/icons/seatIcon.svg?react';

function TrainCard({ train }) {

  
  const [trainDetails, setTrainDetails] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [seatsDetails, setSeatsDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [seatsLoading, setSeatsLoading] = useState(true);
  
  useEffect(() => {
    if (showDetails) {
      console.log("Showing details for train:", train);

      TrainAPI.getTrainCarsDetails(train.id)
        .then(fetchedCars => {
          console.log("Fetched cars:", fetchedCars);
          setCarDetails(fetchedCars);
          setInitialLoading(false); 
        })
        .catch(err => {
          console.error("Error fetching train cars:", err);
        });
    
    }
  }, [showDetails]);

  useEffect(() => {
    if (showDetails && !initialLoading && carDetails.length > 0 && !selectedClass) {
      handleClassSelection(carDetails[0]);
    }
  }, [showDetails, initialLoading, carDetails]);

  const handleProceed = () => {
    console.log("Proceeding with train:", train);
    setShowDetails(true);
    setInitialLoading(true);
  };

  const handleClassSelection = (car) => {
    setSelectedClass(car.carName);

    console.log(" Selected class:", car);
    // es: TrainAPI.getSeats(className).then(...);
    TrainAPI.getSeatsDetailsByCarAndTrain(car.carId, train.id)
      .then(seatsDetails => {
        console.log("Fetched seats details:", seatsDetails);
        setSeatsDetails(seatsDetails);
        setSeatsLoading(false);
      })
      .catch(err => {
        console.error("Error fetching seats details:", err);
      });

  };




  return (
    <Card className="train-card">
      <Card.Body>
        {/* Data */}
        <div className="train-date">
          {train.date.format ? train.date.format('DD MMMM YYYY') : train.date}
        </div>

        {/* Contenuto principale */}
        <Row className="text-center align-items-center">
          {/* Partenza */}
          <Col>
            <div className="station-name">{train.departureStation}</div>
            <div className="station-code">{train.departureStation.slice(0,3).toUpperCase()}</div>
            
            {/* <div className="time">{train.departureTime.format('HH:mm')}</div> */}
            <div className="time">{dayjs(train.departureTime).format('HH:mm')}</div>
          </Col>

          {/* Treno e durata */}
          <Col>
            <div className="train-number">{train.trainNumber}</div>
            <DottedLineWithEnds />
            <div className="duration">{train.duration}</div>
          </Col>

          {/* Arrivo */}
          <Col>
            <div className="station-name">{train.arrivalStation}</div>
            <div className="station-code">{train.arrivalStation.slice(0,3).toUpperCase()}</div>
            <div className="time">{dayjs(train.arrivalTime).format('HH:mm')}</div>
          </Col>
        </Row>

        {!showDetails ?
        <div className="text-end mt-4">
          <Button className="proceed-btn" onClick={handleProceed}>
            PROCEED
          </Button>
        </div> : null}


      {showDetails && !initialLoading ? (
        <div className="mt-4">
          <div className="mb-2">Select Class:</div>
          <Row className="g-2">
            {carDetails.map((car, index) => (
              <Col key={index} xs={6} md={4} lg={3}>
                <Button
                  className={`w-100 py-2 custom-button ${selectedClass === car.carName ? 'active' : ''}`}
                  variant={selectedClass === car.carName ? "primary" : "outline-primary"}
                  onClick={() => handleClassSelection(car)}
                >
                  {capitalizeWords(car.carName)}
                </Button>
              </Col>
            ))}
          </Row>
        </div>
      ) : null} 

     { showDetails && !initialLoading && selectedClass && !seatsLoading ? (
        <div className="mt-4">
          {seatsDetails ? (
          <>
            <CarSeatsInfo
              carSeats={selectedClass}
              totalSeats={seatsDetails.totalSeats}
              availableSeats={seatsDetails.availableSeats}
              occupiedSeats={seatsDetails.bookedSeats}
            />
            <TrainCarRepresentation seatsDetails={seatsDetails} />
          </>
          ) : (
            <div>No seats information available.</div>
          )}
        </div>
      ) : null}
      </Card.Body>
    </Card>
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

export { TrainCard };

const CarSeatsInfo = ({ carSeats, totalSeats, availableSeats, occupiedSeats }) => {
  return (
    <div className="container p-3">
      <div className="d-flex align-items-center mb-2 fw-bold fs-5">
        <span>CAR SEATS :</span>
        <span className="mx-3">{availableSeats}</span>
        <SeatIcon className="seat-green-icon" />
        <span className="mx-3">|</span>
        <span className="me-2">{occupiedSeats}</span>
        <SeatIcon className="seat-red-icon" />
      </div>

      <div className="ms-2 mb-3 fs-6">
        Total seats : {totalSeats}
      </div>
    
    </div>
  );
};


import '../styles/Train.css';

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
function Seat({ seat }) {
  const seatStatus = seat.isBooked ? "Busy" : "Available";

  const popover = (
    <Popover id={`popover-seat-${seat.seatId}`}>
      <Popover.Body className="text-center">
        <strong>{seat.seatNumber}</strong>
        <br />
        {seatStatus}
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

    <Button
      variant='outline-light'
      disabled={seat.isBooked} onClick={() => alert(`Seat ${seat.seatNumber} selected!`)}
    >
      <SeatIcon className={`seat-${seat.isBooked ? "red" : "green"}-icon`} >
      </SeatIcon>
    </Button>
    </OverlayTrigger>
  );
}

function TrainCar({ seatsInfo, columns }) {
  const rows = groupSeatsByRow(seatsInfo.seats);

  return (
    <div className="train-car">
      {Object.entries(rows).map(([rowNumber, rowSeats]) => (
        // <div className="train-row" key={rowNumber}>
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

function TrainCarRepresentation({ seatsDetails }) {
  const totalSeats = seatsDetails.totalSeats;
  const columns = totalSeats === 45 ? 3: totalSeats > 45 ? 4 :2; // esempio di logica per decidere il numero di colonne
  console.log("Rendering TrainCar with columns:", columns);

  return (
    <div className="page">
      <TrainCar seatsInfo={seatsDetails} columns={columns} />

      {/* <h2>2ª Classe</h2>
      <TrainCar seatsInfo={seatsInfoSecond} columns={3} />

      <h2>3ª Classe</h2>
      <TrainCar seatsInfo={seatsInfoThird} columns={4} /> */}
    </div>
  );
}



