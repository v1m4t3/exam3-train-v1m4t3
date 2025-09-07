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

export { Train, Car };