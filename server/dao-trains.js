"use strict";

const sqlite = require('sqlite3');
const dayjs = require('dayjs');

// open the database
const db = new sqlite.Database('trains.db', (err) => {
    if (err) throw err;
});

exports.listTrains = () => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM trains';
        db.all(sql, [], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            const trains = rows.map((t) => ({
                                                id: t.id, 
                                                trainNumber: t.trainNumber,
                                                departureStation: t.departureStation,
                                                departureTime: dayjs(t.departureTime).format('YYYY-MM-DD HH:mm:ss'),
                                                arrivalStation: t.arrivalStation,
                                                arrivalTime: dayjs(t.arrivalTime).format('YYYY-MM-DD HH:mm:ss'),
                                                date: dayjs(t.date).format('YYYY-MM-DD')
                                                }));
            resolve(trains);
        });
    });
};

exports.getExistingCarsByTrainId = (trainId) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT DISTINCT c.id, c.carName, s.trainId FROM seats s  JOIN cars c ON s.carId=c.id WHERE s.trainId=?';
        db.all(sql, [trainId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length === 0) {
                resolve({'Train not found': trainId});
                return;
            }
            const cars = rows.map((c) => ({
                                                idCar: c.id, 
                                                carName: c.carName,
                                                trainId: c.trainId}));
            resolve(cars);
        });
    });
};

exports.getInfoSeatsByTrainIdAndCarId = (trainId, carId) => {

    return new Promise((resolve, reject) => {
        const sql = 'SELECT id, seatNumber, trainId, carId, isBusy FROM seats WHERE trainId=? AND carId=? ORDER BY CAST(SUBSTR(seatNumber, 1, LENGTH(seatNumber) - 1) AS INTEGER), SUBSTR(seatNumber, -1)';
        db.all(sql, [trainId, carId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length === 0) {
                resolve({'Train or Car not found or available': {trainId, carId}});
                return;
            }

            const seats = rows.map((s) => ({
                                                idSeat: s.id, 
                                                seatNumber: s.seatNumber,
                                                trainId: s.trainId,
                                                carId: s.carId,
                                                isBooked: s.isBusy? true: false}));
            resolve(seats);
            
        });
    });
};