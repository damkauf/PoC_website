function clienteInserta(username,documento,nombre,apellido,clave) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `clienteInserta.js [clienteInserta] | Previo a Insertar: '${username}','${documento}','${nombre}','${apellido}','${clave}'`);

        let sql = `CALL clienteInserta('${username}','${documento}','${nombre}','${apellido}','${clave}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `clienteInserta.js [clienteInserta] | Posterior a Insertar: '${username}','${documento}','${nombre}','${apellido}','${clave}'`);
        })

    })

}

function validaUsuario(str) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `clienteInserta.js [validaUsuario] | Usuario a Validar: '${str}')`);

        let sql = `CALL clienteValidaUserExistente('${str}',@salida)`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + 'clienteInserta.js [validaUsuario] | Cantidad Ocurrencias: ' + JSON.stringify(results));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'clienteInserta.js [validaUsuario] | Cantidad Ocurrencias: ' + results[0][0].Salida);
        })

    })

}


function validaDocumento(str) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `clienteInserta.js [validaDocumento] | validaDocumento a Validar: '${str}')`);

        let sql = `CALL clienteValidaDocExistente('${str}',@salida)`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + 'clienteInserta.js [validaDocumento] | Cantidad Ocurrencias: ' + JSON.stringify(results));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'clienteInserta.js [validaDocumento] | Cantidad Ocurrencias: ' + results[0][0].Salida);
        })

    })

}

module.exports = { clienteInserta, validaUsuario, validaDocumento };
