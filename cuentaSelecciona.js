function cuentaSelecciona() {

    return new Promise(function (resolve, reject) {

        const libUtils = require("./utils");
        const libEjecutaSQL = require("./cuentaSeleccionaSQL");
        var cadenita = "";

        console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentaSelecciona] | Ingreso... ');
        var promise = libEjecutaSQL.cuentaSeleccionaSQL();
        console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentaSelecciona] | ... Se genero Promesa... ');

        promise
        .then(function(cadena){
            console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentaSelecciona] | ... evaluando Promesa');
            if(cadena[0].length==0) {
                cadenita += '<option disabled hidden selected>... ooops! No hay Cuentas.</option>';
            }
            if(cadena[0].length>0) {
                cadenita += '<option disabled hidden selected>... de esta lista de opciones</option>';
                for (var i = 0; i < cadena[0].length; i++) {
                    console.log ('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentaSelecciona] | cadena[' + i + '].Cuenta:' + cadena[0][i].Cuenta);
                    //console.log ('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js | cadena[' + i + '].Cuenta:' + JSON.stringify(cadena[i]));
                    cadenita += '<option>' + cadena[0][i].Cuenta + '</option><br>';
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

function cuentasPorCliente(username) {

      return new Promise(function (resolve, reject) {

          let mysql  = require('mysql');
          let database = require('./databaseConnection.js');
          let connection = mysql.createConnection(database);
          const libUtils = require("./utils");

          console.log('[' + libUtils.getDateTime() + "] | cuentaSelecciona.js [cuentasPorCliente] | Previo a Seleccionar | Username: '" + username + "'");

          let sql = `CALL cuentaSeleccionaPorCliente('${username}')`;

          connection.query(sql, [true], (error, results) => {
              connection.end();
              if (error) {
                  reject (console.error(error.message));
              }
              if(results.length>0) {
                  console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [cuentasPorCliente] | Posterior a Seleccionar');
                  //console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js | RESULTS begin -----------------------');
                  //console.log(...results);
                  //console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js | RESULTS end -------------------------');
                  resolve(results);
              }
          })
      })
}


function saldoPorCuenta(banco,tipo_cuenta,numero_cuenta) {

      return new Promise(function (resolve, reject) {

          let mysql  = require('mysql');
          let database = require('./databaseConnection.js');
          let connection = mysql.createConnection(database);
          const libUtils = require("./utils");

          console.log('[' + libUtils.getDateTime() + "] | cuentaSelecciona.js [saldoPorCuenta] | Previo a Seleccionar | Banco: '" + banco + "'| Tipo Cuenta: '" + tipo_cuenta + "'| Cuenta: '" + numero_cuenta + "'");

          let sql = `CALL cuentaSaldo('${numero_cuenta}','${banco}','${tipo_cuenta}',@salida)`;

          connection.query(sql, [true], (error, results) => {
              connection.end();
              console.log('[' + libUtils.getDateTime() + '] | ' + 'cuentaSelecciona.js [saldoPorCuenta] | Saldo Cuenta: ' + results[0][0].Salida);
              resolve(results);
          })
      })
}


function reporteCuentas(username) {

    return new Promise(function (resolve, reject) {

        let mysql  = require('mysql');
        let database = require('./databaseConnection.js');
        let connection = mysql.createConnection(database);
        const libUtils = require("./utils");

        console.log('[' + libUtils.getDateTime() + "] | cuentaSelecciona.js [reporteCuentas] | Previo a Seleccionar | Username: '" + username + "'");

        let sql = `CALL cuentaReporte('${username}')`;

        connection.query(sql, [true], (error, results) => {
            connection.end();
            if (error) {
                reject (console.error(error.message));
            }
            if(results.length>0) {
                console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [reporteCuentas] | Posterior a Seleccionar');
                //console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [reporteCuentas] | RESULTS begin -----------------------');
                //console.log(...results);
                //console.log('[' + libUtils.getDateTime() + '] | cuentaSelecciona.js [reporteCuentas] | RESULTS end -------------------------');
                resolve(results);
            }
        })
    })
}


module.exports = { cuentaSelecciona, cuentasPorCliente, saldoPorCuenta, reporteCuentas };
