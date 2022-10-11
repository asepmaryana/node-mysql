const mysql = require('mysql');

const config = {
    host: process.env.DB_Host,
    user: process.env.DB_Username,
    password: process.env.DB_Password,
    database: process.env.DB_Name
}

function makeConnection(connection) {
    return new Promise((resolve, reject) => {
        try {
            connection.connect((err) => {
                if (err) return reject({
                    status: false,
                    message: 'Could not connect db.',
                    data: null
                });;
                resolve(connection);
            });
        }
        catch (err) {
            console.error(new Date() +" ERROR 0: failed connect DB");
            console.error(err);
        }
    });
}

function IsJson(val) {
    return val instanceof Array || val instanceof Object ? true : false;
}

function readData(connection, query) {
    return new Promise((resolve, reject) => {
        let result = {
            status: false,
            message: '',
            data: []
        }
        try {
            connection.query(query, (err, rows) => {
                if (err) result['message'] = err['message'];
                else if (rows.length <= 0){
                    result['status'] = false;
                    result['message'] = 'Data not found !';
                }
                else {
                    result['status'] = true;
                    result['message'] = 'Data read successfully.';
                    result['data'] = rows;
                }
                connection.end();
                resolve(result);
            });
        }
        catch (e) {
            result['message'] = e.message;
            resolve(result);
        }
    });
}

function insertData(connection, query, returnId = false) {
    return new Promise((resolve) => {
        let result = {
            status: false,
            message: null,
            data: null
        }
        try {
            connection.query(query, (err, rows, fields) => {
                if (err) result['message'] = err['message'];
                else {
                    result['status'] = true;
                    result['message'] = 'Data inserted successfully';
                    result['data'] = returnId ? rows.insertId : null;
                }
                connection.end();
                resolve(result);
            });
        }
        catch(e) {
            result['message'] = e['message'];
            resolve(result);
        }
    });
}

function updateData(connection, query) {
    return new Promise((resolve) => {
        let result = {
            status: false,
            message: null,
            data: null
        }
        try {
            connection.query(query, (err, rows, fields) => {
                if (err) result['message'] = err['message'];
                else {
                    result['status'] = true;
                    result['message'] = 'Data updated successfully';
                    result['data'] = rows['affectedRows'];
                }
                connection.end();
                resolve(result);
            });
        }
        catch (e) {
            result['message'] = e['message'];
            resolve(result);
        }
    });
}

function deleteData(connection, query) {
    return new Promise((resolve) => {
        let result = {
            status: false,
            message: null,
            data: null
        }
        try {
            connection.query(query, (err, rows, fields) => {
                if (err) result['message'] = err['message'];
                else {
                    result['status'] = true;
                    result['message'] = 'Data deleted successfully';
                    result['data'] = rows['affectedRows'];
                }
                connection.end();
                resolve(result);
            });
        }
        catch (e) {
            result['message'] = e['message'];
            resolve(result);
        }
    });
}

exports.read = (query, newConnect = null) => {
    let connection;
    if (IsJson(newConnect)) connection = mysql.createConnection(newConnect);    
    else connection = mysql.createConnection(config);

    return makeConnection(connection).then(() => {
        return readData(connection, query).then((result) => result);
    }).catch(err => {
        return {
            status: false,
            message: err['message'],
            data: null
        }
    });
}

exports.insert = (query, returnId = false, newConnect = null) => {
    let connection;
    if (IsJson(newConnect)) connection = mysql.createConnection(newConnect);
    else connection = mysql.createConnection(config);

    return makeConnection(connection).then(() => {
        return insertData(connection, query, returnId).then((result) => result);
    }).catch(err => {
        return {
            status: false,
            message: err['message'],
            data: null
        }
    })
}

exports.update = (query, newConnect = null) => {
    let connection;
    if (IsJson(newConnect)) connection = mysql.createConnection(newConnect);
    else connection = mysql.createConnection(config);

    return makeConnection(connection).then(() => {
        return updateData(connection, query).then((result) => result);
    }).catch(err => {
        return {
            status: false,
            message: err['message'],
            data: null
        }
    })
}

exports.delete = (query, newConnect = null) => {
    let connection;
    if (IsJson(newConnect)) connection = mysql.createConnection(newConnect);
    else connection = mysql.createConnection(config);

    return makeConnection(connection).then(() => {
        return deleteData(connection, query).then((result) => result);
    }).catch(err => {
        return {
            status: false,
            message: err['message'],
            data: null
        }
    })
}
