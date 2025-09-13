import dayjs from 'dayjs';
import { Ticket } from '../Models/TicketModels';
const URL = 'http://localhost:3001/api/reservations';


async function getInfoSeatsByTrainIdAndCarIdAndUserIdLoggedIn(trainId, carId) {
    let response = await fetch(URL + `/trains/${trainId}/cars/${carId}/seats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (response.ok) {
        const seats = await response.json();
        return seats;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}
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
        if (reservations.type === 'no_reservation') return [];
        console.log("reservations: ", reservations);
        return reservations.map(t => new Ticket(t.reservationId, t.dateIssued, t.totalPrice, t.seatCount, t.trainId, t.trainNumber, t.departureStation, t.departureTime, t.arrivalStation, t.arrivalTime, t.trainDate, t.carId, t.carName));
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getReservationById(reservationId) {
    let response = await fetch(URL + `/${reservationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (response.ok) {
        const t = await response.json();
        return t;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

// create a new reservation
// takes in input and object with: 
// {
//   "trainId": ?,
//   "carId": ?,
//   "seatIds": [?, ?..., ?]
// }
// and returns the created reservation or different type of errors
async function createNewReservation(reservation) {
    let response = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(reservation),
    });
    const data = await response.json();
    if (response.ok) {
        return data;
    } else {
        throw data;
    }
}

async function deleteReservationById(reservationId) {
    let response = await fetch(URL + `/${reservationId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (response.ok) {
        return;
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

export default { getInfoSeatsByTrainIdAndCarIdAndUserIdLoggedIn, getUserReservations, 
                    getReservationById, createNewReservation, deleteReservationById };