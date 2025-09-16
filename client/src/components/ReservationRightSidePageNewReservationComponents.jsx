import { useState } from 'react';
// import '../styles/ReservationPage.css';
import '../styles/LeftPage.css';
import '../styles/TicketCard.css';
import '../styles/RightPage.css'
import { useEffect } from 'react';
import  TicketAPI  from '../API/TicketAPI.js';
import dayjs from 'dayjs';
import { capitalizeWords } from '../utils.js';
import SeatIconSmall from '../assets/icons/seatIconSmall.svg?react';
import SeatIcon from '../assets/icons/seatIcon.svg?react';
import { Button, Card, Col, Alert, OverlayTrigger, Popover, Row, Tooltip, Form, InputGroup } from 'react-bootstrap';
import DottedLineWithEnds from './UtilsComponents.jsx';
import TrainAPI from '../API/TrainAPI.js';
import {ConfirmModalNewReservation} from './ConfirmModalNewReservationComponents.jsx';
import { FIRST_CLASS_CAR_NAME } from './constants.js';
import { groupSeatsByRow, seatStatusToColor} from '../utils.js';

// ***** Ticket Card New Reservation Component ******

function TrainCardNewReservation({ train, loggedInTotp, setAlertNewReservation, conflictSeatsList, setConflictSeatsList }) {

  const [trainDetails, setTrainDetails] = useState(null);
  const [carDetails, setCarDetails] = useState(null);
  const [seatsDetails, setSeatsDetails] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [seatsLoading, setSeatsLoading] = useState(true);

  // Track selected seat IDs for the new reservation
  const [selectedSeatIds, setSelectedSeatIds] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDirtyShowDetails, setIsDirtyShowDetails] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    if (showDetails ) {
      console.log("Showing details for train:", train);

      TrainAPI.getTrainCarsDetails(train.id)
        .then(fetchedCars => {
          if (!Array.isArray(fetchedCars) || fetchedCars.length === 0) {
            setShowAlert(true);
            setShowDetails(false);
            setSelectedClass(null);
            setSeatsDetails(null);
            setInitialLoading(false);
            return;
          }
          console.log("Fetched cars:", fetchedCars);
          setTrainDetails(train);
          setCarDetails(fetchedCars);
          setIsDirtyShowDetails(false);
          setInitialLoading(false);
        })
        
        .catch(err => {
          console.error("Error fetching train cars:", err);
        });
    
    }
  }, [showDetails]);

  useEffect(() => {
    if (showDetails && !initialLoading && Array.isArray(carDetails) && carDetails.length > 0 && !selectedClass) {
      handleClassSelection(carDetails[0]);
    }
  }, [showDetails, initialLoading, carDetails]);

  const handleProceed = () => {
    console.log("Proceeding with train:", train);
    setShowDetails(true);
    setInitialLoading(true);
  };

  const handleHideDetails = () => {
    setShowDetails(false);
    setSelectedClass(null);
    setSeatsDetails(null);
  };
  const handleClassSelection = (car) => {
    setSelectedClass(car);
    setIsDirtyShowDetails(true);

    console.log(" Selected class:", car);

  };

  const [startTimer, setStartTimer] = useState(false);
  // timer to show the seat status in blue for 7 seconds
  useEffect(() => {
    let timer;
    if (startTimer) {
      timer = setTimeout(() => {
        setIsDirtyShowDetails(true);
        setStartTimer(false);
      }, 7000); // Stop the timer after 7 seconds
    }
    return () => clearTimeout(timer);
  }, [startTimer]);

  // To get info about seats when selectedClass or isDirtyShowDetails changes
  useEffect(() => {
    if (isDirtyShowDetails && showDetails) {
      TicketAPI.getInfoSeatsByTrainIdAndCarIdAndUserIdLoggedIn(trainDetails.id, selectedClass.carId)
      .then(seatsDetails => {
        console.log("Fetched seats details:", seatsDetails);
        if (seatsDetails.length === 0) {
          console.log("No seats details available for this car.");
          setSeatsDetails(null);
          setSelectedSeatIds([]);
          setSeatsLoading(false);
          setShowAlert(true);
          return;
        }
        console.log("Fetched seats details:", seatsDetails);
        // Highlight conflict seats in blue 
        if (conflictSeatsList.length > 0) {
          console.log("Highlighting conflict seats in blue:", conflictSeatsList);
          seatsDetails = seatsDetails.map(seat => ({
            ...seat,
            seatStatus: conflictSeatsList.includes(seat.seatId) ? 'blue' : seat.seatStatus
          }));
          console.log("Seats details after highlighting conflicts:", seatsDetails);
          setStartTimer(true);
          //setConflictSeatsList([]); // Clear conflict seats after highlighting
        }
        setSeatsDetails(seatsDetails);
        setSelectedSeatIds([]);
        setSeatsLoading(false);
      })

      .catch(err => {
        console.error("Error fetching seats details:", err);
      });
      setIsDirtyShowDetails(false);
    }


  }, [isDirtyShowDetails]);


  return (
    <>
    <Card className="ticket-card-details">
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
        </div> : 
        <div className="text-end mt-4">
          <Button className="proceed-btn" onClick={handleHideDetails}>
            HIDE DETAILS
          </Button>
        </div>}
      
        {showDetails && !initialLoading && Array.isArray(carDetails) && carDetails.length > 0 ? (
              <div className="mt-4">
                <div className="mb-2">Select Class:</div>
                <Row className="g-2">
                  {carDetails.map((car, index) => (
                    <Col key={index} xs={6} md={4} lg={3}>
                      <Button
                        className={`w-100 py-2 card-car-button ${selectedClass?.carName === car.carName ? 'selected' : ''}`}
                        variant={selectedClass?.carName === car.carName ? "primary" : "outline-primary"}
                        onClick={() => handleClassSelection(car)}
                      >
                        {capitalizeWords(car.carName)}
                      </Button>
                    </Col>
                  ))}
                </Row>
              </div>
            ) : null} 

          {showAlert && (
            <Alert variant="warning" onClose={() => {setShowAlert(false); setErrorMessage('')}} dismissible className="mt-4">
              No cars available for this train.
            </Alert>
          )}
          {!loggedInTotp && selectedClass && selectedClass.carName == FIRST_CLASS_CAR_NAME && (
            <Alert variant="danger" className="mt-4">
              For security reasons, please complete the TOTP verification to proceed with seat selection in First Class.
            </Alert>
          )}

     { showDetails && !initialLoading && selectedClass && !seatsLoading ? (
        <div className="mt-4">
          {seatsDetails ? (
          <>
            <CarSeatsInfoNewReservation
              seatsInfo={seatsDetails}
              selectedSeatIds={selectedSeatIds}
            />
            <div className='mt-4'>
              <ChooseRandomSeatsNewReservation seatsInfo={seatsDetails} 
                                                selectedSeatIds={selectedSeatIds} 
                                                setSelectedSeatIds={setSelectedSeatIds} />
            </div>
            <div className="page mt-5">

              <TrainCarNewReservation seatsInfo={seatsDetails} 
                                      setSelectedSeatIds={setSelectedSeatIds}
                                      selectedSeatIds={selectedSeatIds} />
            </div>
            {/* <TrainCarRepresentationNewReservation seatsDetails={seatsDetails} /> */}

            <div className="text-end mt-4">
              <Button className="proceed-btn" 
                      onClick={() => setShowConfirmModal(true)} 
                      disabled={selectedSeatIds.length === 0 || (selectedClass.carName == FIRST_CLASS_CAR_NAME && !loggedInTotp)}
                    >
                SUBMIT
              </Button>
            </div>
          </>
          ) : (
            <div>No seats information available.</div>
          )}
        </div>
      ) : null}
      </Card.Body>
    </Card>

    {showConfirmModal && (
      <ConfirmModalNewReservation
        showConfirmModal={showConfirmModal}
        setShowConfirmModal={setShowConfirmModal}
        trainInfo={train}
        selectedClass={selectedClass}
        selectedSeatsInfo={seatsDetails.filter(seat => selectedSeatIds.includes(seat.seatId))}
        setAlertNewReservation={setAlertNewReservation}
        setIsDirtyShowDetails={setIsDirtyShowDetails}
        setConflictSeatsList={setConflictSeatsList}
    />)}

    </>
  );
}


export { TrainCardNewReservation };

const CarSeatsInfoNewReservation = ({seatsInfo, selectedSeatIds}) => {

  const getEffectiveSeatStatus = (seat) => {
    if (seat.seatStatus === 'green' && selectedSeatIds.includes(seat.seatId)) return 'yellow';
    if (seat.seatStatus === 'yellow' && !selectedSeatIds.includes(seat.seatId)) return 'green';
    return seat.seatStatus;
  };

  const effectiveSeatsStatuses = seatsInfo.map(getEffectiveSeatStatus);

  const counts = {
    yellow: effectiveSeatsStatuses.filter(s => s === 'yellow').length,
    orange: effectiveSeatsStatuses.filter(s => s === 'orange').length,
    red: effectiveSeatsStatuses.filter(s => s === 'red' || s === 'blue').length,
    green: effectiveSeatsStatuses.filter(s => s === 'green').length,
  };
  const totalSeats = seatsInfo.length;
  return (
    <div className="container p-3">
      <div className="text-left mb-3 pt-5">
            <span className='fw-bold fs-7'>CAR SEATS: </span>

            {/* //seats selected by user in yellow */}
            <span className='fw-bold fs-7 ms-4'> {counts.yellow} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Chosen by you in this reservation"}</Tooltip>}>
              <span><SeatIconSmall className="seat-yellow-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {counts.orange} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by you in another reservation"}</Tooltip>}>
              <span><SeatIconSmall className="seat-orange-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {counts.red} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Occupied by others"}</Tooltip>}>
              <span><SeatIconSmall className="seat-red-icon" /></span>
            </OverlayTrigger>

            <span className="vr mx-3" style={{ height: '1.2rem', display: 'inline-block', color: '#999999' }}></span>

            <span className='fw-bold fs-7 '> {counts.green} </span>
            <OverlayTrigger placement="top" overlay={<Tooltip>{"Available seat"}</Tooltip>}>
              <span><SeatIconSmall className="seat-green-icon" /></span>
            </OverlayTrigger>

      </div> 
      <div className="mb-3 fs-7">
        Total seats : {totalSeats}
      </div>
    
    </div>
  );
};

function getRandomElements(allSeats, alreadySelected, n) {
  // Get only available seats
  allSeats = allSeats.filter(
    seat => seat.seatStatus === 'green' || seat.seatStatus === 'yellow'
  );
  
  // Get only valid selected seats
  let seatsToAdd = allSeats.filter(seat =>
    alreadySelected.includes(seat.seatId)
  );

  // If you already have enough, return the first n
  if (seatsToAdd.length >= n) {
    seatsToAdd = seatsToAdd.sort(() => 0.5 - Math.random());
    return seatsToAdd.slice(0, n);
  }

  // Remove those already added from the rest
  const remainingSeats = allSeats.filter(
    seat => !alreadySelected.includes(seat.seatId)
  );

  // Shuffle and add the missing ones
  const shuffled = remainingSeats.sort(() => 0.5 - Math.random());
  const extraSeats = shuffled.slice(0, n - seatsToAdd.length);

  return [...seatsToAdd, ...extraSeats];
}


function ChooseRandomSeatsNewReservation({ seatsInfo, selectedSeatIds, setSelectedSeatIds }) {
  const [numToSelect, setNumToSelect] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const min = 1;
  const availableSeats = seatsInfo.filter(
    seat => seat.seatStatus === 'green' || seat.seatStatus === 'yellow'
  );

  const handleInputChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setNumToSelect(val);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const intVal = parseInt(numToSelect, 10);
    if (!isNaN(intVal) && intVal >= min && intVal <= availableSeats.length) {
      const randomSeats = getRandomElements(availableSeats, selectedSeatIds, intVal);
      const seatIds = randomSeats.map(seat => seat.seatId);
      setSelectedSeatIds(seatIds);
      setNumToSelect('')
      console.log("Selected random seat IDs:", seatIds);


      showAlert ? setShowAlert(false) : null;

    } else {
      setShowAlert(true)
    }
  };

  return (
    <>

    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="chooseRandomSeats">
        <Form.Label>Choose Random Seats</Form.Label>
        <InputGroup >
          <Form.Control
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={numToSelect}
            onChange={handleInputChange}
            placeholder={`Enter a number between ${min} and ${availableSeats.length}`}
            min={min}
            max={availableSeats.length}
            disabled={availableSeats.length === 0}
          />
          <Button
            type="submit"
            variant="primary"
            className='submit-random-seats' 
            aria-label="Submit"
            disabled={availableSeats.length === 0}
          >
            {/* Freccia SVG semplice */}
            <i className="bi bi-send-fill"></i>
          </Button>
        </InputGroup>
      </Form.Group>
    </Form>
    {showAlert && (
      <Alert variant='danger' onClose={() => setShowAlert(false)} dismissible>
        <p>
          Please enter a number between {min} and {availableSeats.length}.
        </p>
      </Alert>
    )}
    {availableSeats.length === 0 && (
      <Alert variant='warning'>
        <p>
          We are sorry, reservations for this car are ended.
        </p>
      </Alert>
    )}
    </>
  );
}

function SeatNewReservation({ seat, selected, onSeatClick }) {
  const isSelectable = seat.seatStatus === 'green' || seat.seatStatus === 'yellow';

  const computedStatus = seat.seatStatus === 'green' && selected
    ? 'yellow'
    : seat.seatStatus === 'yellow' && !selected
    ? 'green'
    : seat.seatStatus;

  const popover = (
    <Popover id={`popover-seat-${seat.seatId}`}>
      <Popover.Body className="text-center">
        <strong>{seat.seatNumber}</strong>
        <br />
        Seat Price: {seat.seatPrice} €
        <br />
        <br />
        {seatStatusToColor(computedStatus)}
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
      <div className="seat-container">
        <SeatIcon
          className={`seat-${computedStatus}-icon`}
          onClick={() => {
            if (isSelectable) onSeatClick(seat.seatId);
          }}
        />
      </div>
    </OverlayTrigger>
  );
}

// Train Car for New Reservation Component
// Get in input the seatsInfo array and a callback to notify the parent component of seat selection changes(to update the total number of selected seats)
function TrainCarNewReservation({ seatsInfo, selectedSeatIds, setSelectedSeatIds }) {

  // Toggle seat selection and notify parent component calling onSeatSelectionChange
  // generate a new array with the updated selection and set it as state
  // then call the callback with the updated array 
  const toggleSeatSelection = (seatId) => {
    // check if seatId is already selected
    const updated = selectedSeatIds.includes(seatId)
      ? selectedSeatIds.filter((id) => id !== seatId) // remove it
      : [...selectedSeatIds, seatId]; // add it
    setSelectedSeatIds(updated);
  }

  const rows = groupSeatsByRow(seatsInfo);
  const totalSeats = seatsInfo.length;
  const columns = totalSeats === 45 ? 3 : totalSeats > 45 ? 4 : 2;

  return (
    <>
    <div className="container p-6">
      <div className="d-flex align-items-center mb-4 fw-bold fs-7">
        <span>CHOOSE YOUR SEAT: </span> 
      </div>
    </div>

    <div className="train-car train-car-size">
      {Object.entries(rows).map(([rowNumber, rowSeats]) => (
        <div className={`train-row-${columns}`} key={rowNumber}>
          <div className="train-row-label">{rowNumber}</div>

          {rowSeats.slice(0, Math.floor(columns / 2)).map((s) => (
            <SeatNewReservation
              key={s.seatId}
              seat={s}
              selected={selectedSeatIds.includes(s.seatId)}
              onSeatClick={toggleSeatSelection}
            />
          ))}

          <div className="train-aisle" />

          {rowSeats.slice(Math.floor(columns / 2)).map((s) => (
            <SeatNewReservation
              key={s.seatId}
              seat={s}
              selected={selectedSeatIds.includes(s.seatId)}
              onSeatClick={toggleSeatSelection}
            />
          ))}

          <div className="train-row-label">{rowNumber}</div>
        </div>
      ))}
    </div>
    </>
  );
}
