function servicioInserta(servicio,codigo,usuario,importe) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `servicioInserta.js [servicioInserta] | Previo a Insertar: '${servicio}','${codigo}','${usuario}',${importe}`);

        let sql = `CALL servicioInserta('${servicio}','${codigo}','${usuario}',${importe})`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `servicioInserta.js [servicioInserta] | Posterior a Insertar: '${servicio}','${codigo}','${usuario}',${importe}`);
        })

    })

}

function validaServicio(servicio, usuario) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `servicioInserta.js [validaServicio] | Servicio a Validar: '${servicio}', '${usuario}'`);

        let sql = `CALL servicioValidaExistente('${servicio}', '${usuario}',@salida)`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + 'servicioInserta.js [validaServicio] | Cantidad Ocurrencias: ' + JSON.stringify(results));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'servicioInserta.js [validaServicio] | Cantidad Ocurrencias: ' + results[0][0].Salida);
        })

    })

}


function validaCodigoServicio(servicio) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `servicioInserta.js [validaCodigoServicio] | Servicio a Validar: '${servicio}'`);

        let sql = `CALL servicioValidaCodigoExistente('${servicio}',@salida)`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + 'servicioInserta.js [validaCodigoServicio] | Cantidad Ocurrencias: ' + JSON.stringify(results));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'servicioInserta.js [validaCodigoServicio] | Cantidad Ocurrencias: ' + results[0][0].Salida);
        })

    })

}


module.exports = { servicioInserta, validaServicio, validaCodigoServicio };
