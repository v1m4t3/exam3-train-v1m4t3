import { Card, Button, Row, Col } from 'react-bootstrap';
import '../styles/TrainCard.css';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
function TrainCard({ train }) {
  
  const [showDetails, setShowDetails] = useState(false);
  const [selectedClass, setSelectedClass] = useState("First Class");



  const handleProceed = () => setShowDetails(true);

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
