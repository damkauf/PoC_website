function clienteElimina(username) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + '] | ' + `clienteElimina.js | Previo a Eliminar: '${username}'`);

        let sql = `CALL clienteElimina('${username}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            resolve(results);
            console.log('[' + libUtils.getDateTime() + '] | ' + `clienteElimina.js | Posterior a Eliminar: '${username}'`);
        })

    })

}

module.exports = { clienteElimina };
