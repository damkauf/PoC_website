function clienteSeleccionaSQL(retorno) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | clienteSeleccionaSQL.js [clienteSeleccionaSQL] | Previo a Seleccionar');

        let sql = `CALL clienteSelecciona()`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            if (error) {
                reject (console.error(error.message));
            }
            if(results.length > 0) {
                console.log('[' + libUtils.getDateTime() + '] | clienteSeleccionaSQL.js [clienteSeleccionaSQL] | Posterior a Seleccionar');
                //console.log('[' + libUtils.getDateTime() + '] | clienteSeleccionaSQL.js [clienteSeleccionaSQL] | RESULTS begin -----------------------');
                //console.log(...results);
                //console.log('[' + libUtils.getDateTime() + '] | clienteSeleccionaSQL.js [clienteSeleccionaSQL] | RESULTS end -------------------------');
                resolve(results);
            }
        })
    })
}

module.exports = { clienteSeleccionaSQL };
