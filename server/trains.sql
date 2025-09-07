BEGIN TRANSACTION;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS "trains" (
    "id"	            INTEGER PRIMARY KEY AUTOINCREMENT,
    "trainNumber"	    TEXT NOT NULL UNIQUE,
    "departureStation"	TEXT NOT NULL,
    "departureTime"	    DATE NOT NULL,
    "arrivalStation"	TEXT NOT NULL,
    "arrivalTime"	    DATE NOT NULL,
    "date"	            DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS "cars" (
    "id"	            INTEGER PRIMARY KEY AUTOINCREMENT,
    "carName"	        TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS "users" (
    "id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
    "email"	        TEXT NOT NULL UNIQUE,
    "name"	        TEXT NOT NULL,
    "surname"	    TEXT NOT NULL,
    "hash"	        TEXT,
    "salt"	        TEXT,
    "secret"	    TEXT
);

CREATE TABLE IF NOT EXISTS "reservations" (
    "id"	        INTEGER PRIMARY KEY AUTOINCREMENT,
    "dateIssued"	DATE NOT NULL,
    "totalPrice"	REAL NOT NULL CHECK("totalPrice" >= 0),
    "userId"	    INTEGER NOT NULL,
    FOREIGN KEY("userId") REFERENCES "users"("id")
);

CREATE TABLE IF NOT EXISTS "seats" (
    "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
    "seatNumber"	TEXT NOT NULL,
    "price"	REAL NOT NULL CHECK("price" > 0),
    "isBusy"	INTEGER DEFAULT 0 CHECK("isBusy" IN (0,1)),
    "trainId"	INTEGER NOT NULL,
    "carId"	    INTEGER NOT NULL,
    "reservationId" INTEGER,
    FOREIGN KEY("trainId") REFERENCES "trains"("id"),
    FOREIGN KEY("carId") REFERENCES "cars"("id"),
    FOREIGN KEY("reservationId") REFERENCES "reservations"("id")
    UNIQUE(trainId, carId, seatNumber)
);
INSERT INTO "users" (email, name, surname, hash, salt, secret) VALUES ('harry@test.com','Harry', 'Potter','5fa1ee21b53713031055d12167f61eb5490e7a396f8d7d267afccddd1db6e044','99204c03b9203056fb7cd8861aeaf412','LXBSMDTMSP2I5XFXIYRGFVWSFI');
INSERT INTO "users" (email, name, surname, hash, salt, secret) VALUES ('luigi@test.it', 'Luigi', 'Tocco','82839cff73db80b35f6a23d82cb6e562a4c343b70e05d7a84eefb9f68a58c484','bbc12e4d81dd2c645b4929e25c471d55','LXBSMDTMSP2I5XFXIYRGFVWSFI');

INSERT INTO "trains" (trainNumber, departureStation, departureTime, arrivalStation, arrivalTime, date) VALUES ('T123','Turin', '2024-07-01 08:00:00','Milan','2024-07-01 10:00:00','2024-07-01');

INSERT INTO "cars" (carName) VALUES ('first class');
INSERT INTO "cars" (carName) VALUES ('second class');
INSERT INTO "cars" (carName) VALUES ('economy class');

INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9B', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10A', 50.0, 1, 1);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10B', 50.0, 1, 1);

INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14C', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15A', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15B', 30.0, 1, 2);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15C', 30.0, 1, 2);



INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('1D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('2D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('3D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('4D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('5D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('6D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('7D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('8D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('9D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('10D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('11D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('12D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('13D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('14D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('15D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('16A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('16B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('16C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('16D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('17A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('17B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('17C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('17D', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('18A', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('18B', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('18C', 20.0, 1, 3);
INSERT INTO "seats" (seatNumber, price, trainId, carId) VALUES ('18D', 20.0, 1, 3);




COMMIT;