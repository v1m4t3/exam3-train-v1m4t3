'use strict';

/* Data Access Object (DAO) module for accessing users data */

const db = require('./db');
const crypto = require('crypto');   
   


// Get user by email and password: used for login
exports.getUser = (email, password) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM users WHERE email = ?';
        db.get(sql, [email], (err, row) => {
        if (err) {
            reject(err);
        } else if (row === undefined) {
            resolve(false);
        } else {
            //creations of the user object
            const user = {
                id: row.id,
                username: row.email,
                name: row.name,
                surname: row.surname,
                secret: row.secret
            };

            const salt = row.salt;
            crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                if (err) reject(err);

                const passwordHex = Buffer.from(row.password, 'hex');
                //check if the password is correct
                if(!crypto.timingSafeEqual(passwordHex, hashedPassword))
                    resolve(false);
                else 
                    resolve(user); 
            });
        }
      });
    });
  };

exports.getUser = (email, password) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE email=?';
    db.get(sql, [email], (err, row) => {
      if (err) {
        reject(err);
      } else if (row === undefined) {
        resolve(false);
      }
      else {
        const user = { id: row.id, username: row.email, name: row.name, secret: row.secret };

        // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
          if (err) reject(err);
          if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
            resolve(false);
          else
            resolve(user);
        });
      }
    });
  });
};
