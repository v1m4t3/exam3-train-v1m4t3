import dayjs from 'dayjs';
import { Ticket } from '../Models/TicketModels';
const URL = 'http://localhost:3001/api/reservations';


async function getUserReservations() {
    let response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (response.ok) {
        const reservations = await response.json();
        return reservations.map(t => new Ticket(t.reservationId, t.dateIssued, t.totalPrice, t.seatCount, t.trainId, t.trainNumber, t.departureStation, t.departureTime, t.arrivalStation, t.arrivalTime, t.trainDate, t.carId, t.carName));
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}



export default { getUserReservations };