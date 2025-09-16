import { useState } from 'react';
// import '../styles/ReservationPage.css';
import '../styles/LeftPage.css';
import '../styles/TicketCard.css';
import '../styles/RightPage.css'
import { useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { TrainCardNewReservation} from './ReservationRightSidePageNewReservationComponents.jsx';
import { TicketCardDetails } from './ReservationRightSideTicketCardBookedPageComponents.jsx';
// ***** Right Side Component ******
function RightSide(props) {
    const { newReservation, setNewReservation, 
            user, loggedIn, loggedInTotp, 
            listOfTrains, initialLoading, errorMsg, setErrorMsg, 
            reservationDetails, setReservationDetails, setDirty} = props;

    const [alertNewReservation, setAlertNewReservation] = useState(null);
    const [conflictSeatsList, setConflictSeatsList] = useState([]);
    const [errorMessageNewReservation, setErrorMessageNewReservation] = useState('');

    useEffect(() => {
      if (alertNewReservation) {
        setDirty(true);
        const timer = setTimeout(() => {
          setAlertNewReservation(null);
        }, 7000);
        return () => clearTimeout(timer);
      }
    }, [alertNewReservation]);

    useEffect(() => {
      if (conflictSeatsList.length > 0) {
        console.log("Conflict seats list updated, starting timer to clear it after 7 seconds");
        const timer = setTimeout(() => {
          console.log("Clearing conflict seats list after 7 seconds");
          setConflictSeatsList([]);
        }, 7000); // 7000 ms = 7 secondi

        return () => clearTimeout(timer); // pulizia del timer se cambia la lista
      }
    }, [conflictSeatsList]);

    return (
       <>
        {reservationDetails && loggedIn && !newReservation ? (
          <TicketCardDetails ticket={reservationDetails} />
        ): null}

        {alertNewReservation &&(
          <Alert variant="success" className="alert-fixed-top" onClose={() => {setAlertNewReservation(false); setErrorMessageNewReservation('')}} dismissible >
              Reservation #{alertNewReservation?.reservationId.data.reservationId} confirmed successfully! 
          </Alert>
        )}
        {conflictSeatsList.length > 0 &&(
          <Alert variant="danger" className="alert-fixed-top" >
            The following seats are already occupied: {conflictSeatsList.join(", ")}
          </Alert>
        )}

        {newReservation && loggedIn && !reservationDetails ? (
          <div className='ticket-card-list-new-reservation'>
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
                <TrainCardNewReservation key={index} train={train} 
                          loggedInTotp={loggedInTotp} 
                          setAlertNewReservation={setAlertNewReservation} 
                          setConflictSeatsList={setConflictSeatsList} 
                          conflictSeatsList={conflictSeatsList}
                        />
              ))
            )}
          </div>
        ): null}
        
       
       </> 

    );
}

export { RightSide };
