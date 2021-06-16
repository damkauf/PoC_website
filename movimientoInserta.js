function movimientoInserta(banco,tipo_cuenta,numero_cuenta,importe) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `movimientoInserta.js [movimientoInserta] | Previo a Insertar: '${banco}','${tipo_cuenta}','${numero_cuenta}',${importe}`);

        let sql = `CALL movimientoInserta('${banco}','${tipo_cuenta}','${numero_cuenta}',${importe})`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `movimientoInserta.js [movimientoInserta] | Posterior a Insertar: '${banco}','${tipo_cuenta}','${numero_cuenta}',${importe}`);
        })

    })

}

module.exports = { movimientoInserta};
