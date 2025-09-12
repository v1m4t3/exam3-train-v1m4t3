import { useState } from "react";
import dayjs from "dayjs";
import { Modal, Button, Spinner, ListGroup } from "react-bootstrap";
import { capitalizeWords } from '../utils.js';
import TicketAPI from "../API/TicketAPI.js";
import {NewReservation} from "../Models/TicketModels.js";

function ConfirmModalNewReservation({showConfirmModal, setShowConfirmModal, trainInfo, 
                                        selectedClass, selectedSeatsInfo, setAlertNewReservation}) {
 const [loading, setLoading] = useState(false); 

  const handleSubmit = () => {
    console.log("DEBUG: " + JSON.stringify(trainInfo, null, 2));
    console.log("DEBUG: " + trainInfo.id);
    console.log("DEBUG: " + selectedClass.carId);
    console.log("DEBUG: " + selectedSeatsInfo.map(seat => seat.seatId));

    setLoading(true);
    // setLoading(false);
    TicketAPI.createNewReservation(
                new NewReservation(trainInfo.id, 
                    selectedClass.carId, 
                    selectedSeatsInfo.map(seat => seat.seatId)
                )).then((res) => {
                    setAlertNewReservation(res);
                }).catch((error) => {
                    // Handle errors (e.g., show an error message)
                    
                }).finally(() => {
                    setShowConfirmModal(false);
                    setLoading(false);
                });

  }

    // Simulated backend call

  return (
    <Modal
      show={showConfirmModal}
      onHide={() => !loading && setShowConfirmModal(false)}
      centered
      dialogClassName="custom-confirm-modal"
      backdrop="static"
    >
      <Modal.Header closeButton={!loading} className="border-0 pb-0">
        <Modal.Title className="w-100 text-center fs-4">
          🧾 Confirm Your Reservation
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="px-4 pt-2">
        <div className="mb-3 d-flex align-items-center gap-2 text-secondary">
          <i className="bi bi-train-front-fill text-primary fs-5"></i>
          <strong>Train:</strong> <span>{trainInfo.trainNumber} {trainInfo.departureStation} - {trainInfo.arrivalStation}</span>
        </div>

        <div className="mb-3 d-flex align-items-center gap-2 text-secondary">
          <i className="bi bi-star-fill text-secondary fs-5"></i>
          <strong>Car:</strong> <span>{capitalizeWords(selectedClass.carName)}</span>
        </div>

        <div className="mb-3 d-flex align-items-center gap-2 text-secondary">
          <i className="bi bi-calendar-date-fill text-secondary fs-5"></i>
          <strong>Date:</strong> <span>{dayjs(trainInfo.date).format('DD MMMM YYYY')}</span>
        </div>




        <h6 className="text-muted mb-2">Selected Seats:</h6>
        <div className="mb-4 d-flex flex-row align-items-center overflow-auto">
        {selectedSeatsInfo.map((seat, idx) => (
            <span key={idx} className="badge bg-primary text-light me-2">
            {seat.seatNumber}
            </span>
        ))}
        </div>

        

        <p className="text-center mt-3 text-dark fs-6">
          Are you sure you want to confirm this reservation?
        </p>
      </Modal.Body>

      <Modal.Footer className="border-0 justify-content-center pb-4">
        <Button
          variant="outline-secondary"
          onClick={() => setShowConfirmModal(false)}
          disabled={loading}
          className="px-4"
        >
          Cancel
        </Button>

        <Button
          variant="warning"
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 fw-bold text-white"
        >
          {loading ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" /> Confirming...
            </>
          ) : (
            "Confirm"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export { ConfirmModalNewReservation };
