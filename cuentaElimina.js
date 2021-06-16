function cuentaElimina(banco,tipo_cuenta,numero_cuenta) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `cuentaElimina.js | Previo a Eliminar: '${banco}','${tipo_cuenta}','${numero_cuenta}'`);

        let sql = `CALL cuentaElimina('${banco}','${tipo_cuenta}','${numero_cuenta}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `cuentaElimina.js | Posterior a Eliminar: '${banco}','${tipo_cuenta}','${numero_cuenta}'`);
        })

    })

}

module.exports = { cuentaElimina };
