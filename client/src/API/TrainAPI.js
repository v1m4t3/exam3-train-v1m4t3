import dayjs from 'dayjs';
import { Train } from '../Models/TrainModels';

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
export default { getAllTrains };