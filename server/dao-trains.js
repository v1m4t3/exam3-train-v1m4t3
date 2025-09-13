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

// -- This query retrieves all seats for a given train and car.
// -- It joins the "seats" table with the "reservations" table using the reservationId.
// -- For each seat, it returns:
// --   - idSeat: the seat ID
// --   - seatNumber: the seat number
// --   - price: the price of the seat
// --   - isBusy: whether the seat is occupied (1) or free (0)
// --   - reservationId: the ID of the reservation if the seat is booked, otherwise NULL
// --   - isMine: a computed field that is 1 if the seat is booked by the given userId, 0 otherwise
exports.getInfoSeatsByTrainIdAndCarIdForNewReservation = (userId, trainId, carId) => {

    return new Promise((resolve, reject) => {
        const sql = `SELECT 
                    s.id, 
                    s.seatNumber, 
                    s.price, 
                    s.isBusy, 
                    s.reservationId, 
                    CASE 
                        WHEN r.userId = ? THEN 1
                    ELSE 0
                    END AS isLoggedUserReserved
                FROM seats s
                LEFT JOIN reservations r ON s.reservationId = r.id
                WHERE s.trainId = ? AND s.carId = ?
                ORDER BY CAST(SUBSTR(seatNumber, 1, LENGTH(seatNumber) - 1) AS INTEGER), SUBSTR(seatNumber, -1);`;
        
        db.all(sql, [userId, trainId, carId], (err, rows) => {
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
                                                price: s.price,
                                                trainId: s.trainId,
                                                carId: s.carId,
                                                isBooked: s.isBusy? true: false,
                                                isLoggedUserReserved: s.isLoggedUserReserved? true: false
                                            }));
            resolve(seats);
            
        });
    });
};

exports.getAllReservationsByUserId = (userId) => {

    return new Promise((resolve, reject) => {
        const sql = `SELECT 
                        r.id AS reservationId,
                        r.dateIssued,
                        r.totalPrice,
                        COUNT(s.id) AS seatCount,
                        t.id AS trainId,
                        t.trainNumber,
                        t.departureStation,
                        t.departureTime,
                        t.arrivalStation,
                        t.arrivalTime,
                        t.date AS trainDate,
                        s.carId,
                        c.carName
                        
                    FROM reservations r
                    JOIN seats s ON r.id = s.reservationId
                    JOIN trains t ON s.trainId = t.id
                    JOIN cars c ON s.carId = c.id
                    WHERE r.userId = ?
                    GROUP BY r.id;`;
        
        db.all(sql, [userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length === 0) {
                resolve({type: 'no_reservation', message: 'No reservations found for user', userId});
                return;
            }

            // reservation list
            const reservations = rows.map((r) => ({
                                                reservationId: r.reservationId, 
                                                dateIssued: dayjs(r.dateIssued).format('YYYY-MM-DD'),
                                                totalPrice: r.totalPrice,
                                                seatCount: r.seatCount,
                                                trainId: r.trainId,
                                                trainNumber: r.trainNumber,
                                                departureStation: r.departureStation,
                                                departureTime: dayjs(r.departureTime).format('YYYY-MM-DD HH:mm:ss'),
                                                arrivalStation: r.arrivalStation,
                                                arrivalTime: dayjs(r.arrivalTime).format('YYYY-MM-DD HH:mm:ss'),
                                                trainDate: dayjs(r.trainDate).format('YYYY-MM-DD'),
                                                carId: r.carId,
                                                carName: r.carName
                                            }) );
            resolve(reservations);
        });
    });
};

exports.getReservationDetailsByReservationIdAndUserId = (reservationId, userId) => {

    return new Promise((resolve, reject) => {
        const sql = `SELECT 
                        r.id AS reservationId,
                        r.dateIssued,
                        r.totalPrice,
                        t.id AS trainId,
                        t.trainNumber,
                        t.departureStation,
                        t.departureTime,
                        t.arrivalStation,
                        t.arrivalTime,
                        t.date AS trainDate,
                        c.id AS carId,
                        c.carName,
                        s.Id AS seatId,
                        s.seatNumber,
                        s.price AS seatPrice
                    FROM reservations r
                    JOIN seats s ON r.id = s.reservationId
                    JOIN cars c ON s.carId = c.id
                    JOIN trains t ON s.trainId = t.id
                    WHERE r.id = ? AND r.userId = ?;`;

        db.all(sql, [reservationId, userId], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            if (rows === undefined || rows.length === 0) {
                resolve({'Reservation not found for user': {reservationId, userId}});
                return;
            }

            // reservation details
            const reservationDetails = {
                reservationId: rows[0].reservationId,
                dateIssued: dayjs(rows[0].dateIssued).format('YYYY-MM-DD'),
                totalPrice: rows[0].totalPrice,
                trainId: rows[0].trainId,
                trainNumber: rows[0].trainNumber,
                departureStation: rows[0].departureStation,
                departureTime: dayjs(rows[0].departureTime).format('YYYY-MM-DD HH:mm:ss'),
                arrivalStation: rows[0].arrivalStation,
                arrivalTime: dayjs(rows[0].arrivalTime).format('YYYY-MM-DD HH:mm:ss'),
                trainDate: dayjs(rows[0].trainDate).format('YYYY-MM-DD'),
                carId: rows[0].carId,
                carName: rows[0].carName,
                seats: rows.map((s) => ({
                    seatId : s.seatId,
                    seatNumber: s.seatNumber,
                    seatPrice: s.seatPrice,
                })),
            };
            resolve(reservationDetails);
        });
    });
};

exports.deleteReservationByReservationIdAndUserId = (reservationId, userId) => {

    return new Promise((resolve, reject) => {
        const sqlCheck = 'SELECT * FROM reservations WHERE id = ? AND userId = ?';
        db.get(sqlCheck, [reservationId, userId], (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            if (row === undefined) {
                resolve({'Reservation not found for user': {reservationId, userId}});
                return;
            }

            const sqlDeleteSeats = 'UPDATE seats SET isBusy = 0, reservationId = NULL WHERE reservationId = ?';
            db.run(sqlDeleteSeats, [reservationId], function(err) {
                if (err) {
                    reject(err);
                    return;
                }

                const sqlDeleteReservation = 'DELETE FROM reservations WHERE id = ?';
                db.run(sqlDeleteReservation, [reservationId], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({'Reservation deleted successfully': reservationId});
                });
            });
        });
    });
};

exports.createNewReservation = (userId, trainId, carId, seatIds) => {

    return new Promise((resolve, reject) => {
        // Step 1: Check if all requested seats are available
        const placeholders = seatIds.map(() => '?').join(',');
        const sqlCheckSeats = `SELECT trainId, carId, id AS seatId, seatNumber, isBusy, price FROM seats WHERE id IN (${placeholders})`;

        db.all(sqlCheckSeats, [...seatIds], (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            
            if (rows.length !== seatIds.length) {
                return reject({type: 'notfound_seats', 
                                message: 'No seats found for the provided IDs'
                            });
            }
            
            console.log('Selected seats:', rows);

            // Check if all seats belong to the specified train and car
            const allInTheSelectedTrain = rows.every(seat => seat.trainId === trainId);
            const allInTheSelectedCar = rows.every(seat => seat.carId === carId);
            if (!allInTheSelectedTrain || !allInTheSelectedCar) {

                console.log('Some seats do not belong to the specified train or car');
                return reject({type: 'invalid_seats', 
                                message: 'All selected seats must belong to the specified train and car' 
                            });
            }

            console.log('All seats belong to the specified train and car');

            // Check if all seats are available otherwise return which ones are occupied
            const allAvailable = rows.every(seat => seat.isBusy === 0);
            
            if (!allAvailable) {
                const occupiedSeats = rows.filter(seat => seat.isBusy !== 0).map(s => ({ id: s.seatId, seatNumber: s.seatNumber }));
                return reject({ type: 'occupied_seats', occupiedSeats });
            }

            // Calculate total price
            const totalPrice = rows.reduce((sum, seat) => sum + seat.price, 0);
            const seatBooked = rows.map(seat => ({ seatId: seat.seatId, seatNumber: seat.seatNumber, price: seat.price }));
            console.log(`Total price for reservation: ${totalPrice}`);

            // Create a new reservation
            const sqlInsertReservation = 'INSERT INTO reservations (userId, dateIssued, totalPrice) VALUES (?, ?, ?)';
            const currentDate = dayjs().format('YYYY-MM-DD');
            db.run(sqlInsertReservation, [userId, currentDate, totalPrice], function(err) {
                if (err) {
                    reject(err);
                    return;
                }
                const reservationId = this.lastID;

                // Step 4: Update seats to mark them as busy and link to the new reservation
                const sqlUpdateSeats = `UPDATE seats SET isBusy = 1, reservationId = ? WHERE id IN (${placeholders})`;
                db.run(sqlUpdateSeats, [reservationId, ...seatIds], function(err) {
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve({type: 'successfully_created', data: {reservationId, totalPrice, trainId, carId, seatBooked}});
                });
            });
        });
    });
};

