const db = require("../connection");

// const getRequests = async (...results) => {
//     // remove null requestids
//     let nullIdIndexes = [];
//     for (let i = 0; i < results.length; i++) {
//         if (results[i].requestid === null) nullIdIndexes.push(i);
//     }

//     for (var i = nullIdIndexes.length - 1; i >= 0; i--) {
//         results.splice(nullIdIndexes[i], 1);
//     }
//     // get requests data
//     let reqs = []
//     for (let i = 0; i < results.length; i++) {
//         db.query("SELECT doc_date,amount,partner,comments FROM request WHERE id = ?", results[i].requestid, (err, result) => {
//             if (err) return ({ statusCode: 400 });
//             else {
//                 results[i].doc_date = result[0].doc_date;
//                 results[i].amount = result[0].amount;
//                 results[i].partner = result[0].partner;
//                 results[i].comments = result[0].comments;
//                 reqs.push(results[i]);

//             }
//             if (i === results.length - 1) {
//                 return reqs;
//             };
//         })

//     }

// }

function getRequests(...results) {
    return new Promise(function (resolve, reject) {
        var reqs = [];
        // remove null requestids
        let nullIdIndexes = [];
        for (let i = 0; i < results.length; i++) {
            if (results[i].requestid === null) nullIdIndexes.push(i);
        }

        for (var i = nullIdIndexes.length - 1; i >= 0; i--) {
            results.splice(nullIdIndexes[i], 1);
        }
        // if (results.length === 0) resolve(reqs);
        // get requests data
        for (let i = 0; i < results.length; i++) {
            db.query("SELECT doc_date,amount,partner,comments FROM request WHERE id = ?", results[i].requestid, (err, result) => {
                if (err) reject(err);
                else {
                    results[i].doc_date = result[0].doc_date;
                    results[i].amount = result[0].amount;
                    results[i].partner = result[0].partner;
                    results[i].comments = result[0].comments;
                    reqs.push(results[i]);

                }
                if (i === results.length - 1) {
                    resolve(reqs);
                };
            })

        }
    })
}

module.exports = { getRequests };