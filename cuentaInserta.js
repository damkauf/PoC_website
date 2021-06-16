function cuentaInserta(cliente,banco,tipo_cuenta,numero_cuenta) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `cuentaInserta.js [cuentaInserta] | Previo a Insertar: '${cliente}','${banco}','${tipo_cuenta}','${numero_cuenta}'`);

        let sql = `CALL cuentaInserta('${cliente}','${banco}','${tipo_cuenta}','${numero_cuenta}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `cuentaInserta.js [cuentaInserta] | Posterior a Insertar: '${cliente}','${banco}','${tipo_cuenta}','${numero_cuenta}'`);
        })

    })

}

function validaCuenta(numero_cuenta, banco, tipo_cuenta) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `cuentaInserta.js [validaCuenta] | Cuenta a Validar: '${banco}','${tipo_cuenta},'${numero_cuenta}'`);

        let sql = `CALL cuentaValidaExistente('${numero_cuenta}','${banco}','${tipo_cuenta}',@salida)`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            //console.log('[' + libUtils.getDateTime() + '] | ' + 'cuentaInserta.js [validaCuenta] | Cantidad Ocurrencias: ' + JSON.stringify(results));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'cuentaInserta.js [validaCuenta] | Cantidad Ocurrencias: ' + results[0][0].Salida);
        })

    })

}

module.exports = { cuentaInserta, validaCuenta };
