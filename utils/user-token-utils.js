const fs = require('fs');
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');
const secretKey = fs.readFileSync(path.resolve(__dirname, '../env/private_key'));

module.exports = {
    getAccessToken: function (payload) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.sign(payload, secretKey, {}, function (err, token) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(token);
            });
        })
    },

    verifyAccessToken: function (jwtToken) {
        return new Promise((resolve, reject) => {
            jsonwebtoken.verify(jwtToken, secretKey, {}, function (err, decoded) {
                if (err) {
                    reject(err);
                    return;
                }
                resolve(decoded);
            });
        });
    }
}