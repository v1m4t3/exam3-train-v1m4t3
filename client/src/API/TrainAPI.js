import dayjs from 'dayjs';
import { Train, Car, SeatsInfo } from '../Models/TrainModels';

const URL = 'http://localhost:3001/api/trains';

async function getAllTrains() {
    let response = await fetch(URL, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const trains = await response.json();
        return trains.map(t => new Train(t.id, t.trainNumber, t.departureStation, t.departureTime, t.arrivalStation, t.arrivalTime, t.date));
    }else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getTrainCarsDetails(trainId) {
    let response = await fetch(`${URL}/${trainId}/cars`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    console.log("Fetching cars for train ID:", trainId);
    console.log("Response status:", response.status);
    if (response.ok) {
        const cars = await response.json();
        console.log("API fetched cars:", cars);
        return cars.map(c => new Car(c.idCar, c.carName, c.trainId));
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}

async function getSeatsDetailsByCarAndTrain(carId, trainId) {
    let response = await fetch(`${URL}/${trainId}/cars/${carId}/seats`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (response.ok) {
        const seatsDetails = await response.json();
        return new SeatsInfo(seatsDetails);
    } else {
        const errDetail = await response.json();
        throw errDetail.message;
    }
}
export default { getAllTrains, getTrainCarsDetails, getSeatsDetailsByCarAndTrain };