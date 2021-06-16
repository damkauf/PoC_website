function servicioElimina(servicio,usuario) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `servicioElimina.js | Previo a Eliminar: '${servicio}','${usuario}'`);

        let sql = `CALL servicioElimina('${servicio}','${usuario}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `servicioElimina.js | Posterior a Eliminar: '${servicio}','${usuario}'`);
        })

    })

}

module.exports = { servicioElimina };
