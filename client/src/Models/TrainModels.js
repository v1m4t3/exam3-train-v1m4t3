'use strict';

import dayjs from "dayjs";

function Train(id, trainNumber, departureStation, departureTime, arrivalStation, arrivalTime, date){
    this.id = id;
    this.trainNumber = trainNumber;
    this.departureStation = departureStation;
    this.departureTime = dayjs(departureTime);
    this.arrivalStation = arrivalStation;
    this.arrivalTime = dayjs(arrivalTime);
    this.date = dayjs(date);
    const totalMinutes = this.arrivalTime.diff(this.departureTime, 'minute');
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.duration = hours + 'h ' + minutes + 'm';


}

function Car(idCar, carName, trainId){
    this.carId = idCar;
    this.carName = carName;
    this.trainId = trainId;
}

function Seat(idSeat, seatNumber, isBooked ){
    this.seatId = idSeat;
    this.seatNumber = seatNumber;
    this.isBooked = isBooked;
}

function SeatsInfo(seats){
    this.totalSeats = seats.length;
    this.availableSeats = seats.filter(s => !s.isBooked).length;
    this.bookedSeats = seats.filter(s => s.isBooked).length;
    this.seats = seats.map(s => new Seat(s.idSeat, s.seatNumber, s.isBooked));

}
export { Train, Car, SeatsInfo };