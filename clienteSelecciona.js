function clienteSelecciona() {

    return new Promise(function (resolve, reject) {

        const libUtils = require("./utils");
        const libEjecutaSQL = require("./clienteSeleccionaSQL");
        var cadenita = "";

        console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [clienteSelecciona] | Ingreso... ');
        var promise = libEjecutaSQL.clienteSeleccionaSQL();
        console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [clienteSelecciona] | ... Se genero Promesa... ');

        promise
        .then(function(cadena){
            console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [clienteSelecciona] | ... evaluando Promesa');
            if(cadena[0].length==0) {
                cadenita += '<option disabled hidden selected>... ooops! No hay Clientes.</option>';
            }
            if(cadena[0].length>0) {
                cadenita += '<option disabled hidden selected>... de esta lista de opciones</option>';
                for (var i = 0; i < cadena[0].length; i++) {
                    console.log ('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [clienteSelecciona] | cadena[' + i + '].Cliente:' + cadena[0][i].Cliente);
                    //console.log ('[' + libUtils.getDateTime() + '] | clienteSelecciona.js | cadena[' + i + '].Cliente:' + JSON.stringify(cadena[i]));
                    cadenita += '<option>' + cadena[0][i].Cliente + '</option><br>';
                }
            }
            resolve(cadenita);
        })
        .catch(function(err){
            console.log(err);
            reject (console.error(error.message));
        })

    })

}

function reporteCliente(username) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + "] | clienteSelecciona.js [reporteCliente] | Previo a Seleccionar | Username: '" + username + "'");

        let sql = `CALL clienteReporte('${username}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            if (error) {
                reject (console.error(error.message));
            }
            if(results.length>0) {
                console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [reporteCliente] | Posterior a Seleccionar');
                //console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [reporteCliente] | RESULTS begin -----------------------');
                //console.log(...results);
                //console.log('[' + libUtils.getDateTime() + '] | clienteSelecciona.js [reporteCliente] | RESULTS end -------------------------');
                resolve(results);
            }
        })
    })
}

module.exports = { clienteSelecciona, reporteCliente };
