"use strict";

import dayjs from "dayjs";

function Ticket(reservationId, dateIssued, totalPrice, seatCount, trainId, trainNumber, departureStation, departureTime, arrivalStation, arrivalTime, trainDate, carId, carName){
    this.reservationId = reservationId;
    this.dateIssued = dayjs(dateIssued);
    this.totalPrice = totalPrice;
    this.seatCount = seatCount;
    this.trainId = trainId;
    this.trainNumber = trainNumber;
    this.departureStation = departureStation;
    this.departureTime = dayjs(departureTime, 'HH:mm');
    this.arrivalStation = arrivalStation;
    this.arrivalTime = dayjs(arrivalTime, 'HH:mm');
    this.trainDate = dayjs(trainDate);
    this.carId = carId;
    this.carName = carName;
    const totalMinutes = this.arrivalTime.diff(this.departureTime, 'minute');
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    this.duration = hours + 'h ' + minutes + 'm';
}



export { Ticket };