/*
function servicioSelecciona() {

    return new Promise(function (resolve, reject) {

        const libUtils = require("./utils");
        const libEjecutaSQL = require("./servicioSeleccionaSQL");
        var cadenita = "";

        console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [servicioSelecciona] | Ingreso... ');
        var promise = libEjecutaSQL.cuentaSeleccionaSQL();
        console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [servicioSelecciona] | ... Se genero Promesa... ');

        promise
        .then(function(cadena){
            console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentaSelecciona] | ... evaluando Promesa');
            if(cadena[0].length==0) {
                cadenita += '<option disabled hidden selected>... ooops! No hay Servicios.</option>';
            }
            if(cadena[0].length>0) {
                cadenita += '<option disabled hidden selected>... de esta lista de opciones</option>';
                for (var i = 0; i < cadena[0].length; i++) {
                    console.log ('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [servicioSelecciona] | cadena[' + i + '].Cuenta:' + cadena[0][i].Servicio);
                    //console.log ('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js | cadena[' + i + '].Cuenta:' + JSON.stringify(cadena[i]));
                    cadenita += '<option>' + cadena[0][i].Servicio + '</option><br>';
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
*/

function serviciosPorCliente(usuario) {

      return new Promise(function (resolve, reject) {

          let mysql  = require('mysql');
          let database = require('./databaseConnection.js');
          let connection = mysql.createConnection(database);
          const libUtils = require("./utils");

          console.log('[' + libUtils.getDateTime() + "] | servicioSelecciona.js [serviciosPorCliente] | Previo a Seleccionar | Cliente: '" + usuario + "'");

          let sql = `CALL servicioSeleccionaPorCliente('${usuario}')`;

          connection.query(sql, [true], (error, results) => {
              connection.end();
              if (error) {
                  reject (console.error(error.message));
              }
              if(results.length>0) {
                  console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [serviciosPorCliente] | Posterior a Seleccionar');
                  //console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js | RESULTS begin -----------------------');
                  //console.log(...results);
                  //console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js | RESULTS end -------------------------');
                  resolve(results);
              }
          })
      })
}

function reporteServicios(username) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + "] | servicioSelecciona.js [reporteServicios] | Previo a Seleccionar | Username: '" + username + "'");

        let sql = `CALL servicioReporte('${username}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            if (error) {
                reject (console.error(error.message));
            }
            if(results.length>0) {
                console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [reporteServicios] | Posterior a Seleccionar');
                //console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [reporteServicios] | RESULTS begin -----------------------');
                //console.log(...results);
                //console.log('[' + libUtils.getDateTime() + '] | servicioSelecciona.js [reporteServicios] | RESULTS end -------------------------');
                resolve(results);
            }
        })
    })
}

module.exports = { serviciosPorCliente, reporteServicios }; //servicioSelecciona
