const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const libInsertarCliente = require("./clienteInserta");
const libInsertarCuenta = require("./cuentaInserta");
const libInsertarServicio = require("./servicioInserta");
const libInsertarMovimiento = require("./movimientoInserta");
const libSeleccionarCliente = require("./clienteSelecciona");
const libSeleccionarCuenta = require("./cuentaSelecciona");
const libSeleccionarServicio = require("./servicioSelecciona");
const libEliminarCliente = require("./clienteElimina");
const libEliminarCuenta = require("./cuentaElimina");
const libEliminarServicio = require("./servicioElimina");
const libUtils = require("./utils");
const fs = require('fs');
var crypto = require('crypto');
var resultado = "";

//Serves all the request which includes /images in the url from Images folder
app.use('/images', express.static(__dirname + '/images'));

var bodyParser = require('body-parser')
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));



app.post('/clienteBaja', function(req,res){
  /*
   var http = require('http')
   var url = require('url');
   var reqUrl = req.url;
*/
   var cliente = req.body.cliente_baja;
   cliente = cliente.split("%20").join(" ");
   var username = cliente.split(" - ")[0].trim();
   //username = username.split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | Cliente: |' + cliente + '|');
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | Username: |' + username + '|');
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | Ingreso... ');
   var promise = libEliminarCliente.clienteElimina(username);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteBaja] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [clienteBaja] | Se elimino la Persona: '${username}'`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteBaja] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
   })
   .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteBaja] | ... finalizando...');
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | Cadena-Clientes: ' + cadena);

        fs.readFile(__dirname + "/html/index.html", (error, data) => {
           if(error) {
               throw error;
           }

           res.send(data.toString().split("$Clientes").join(cadena)
                                   .replace('$MensajeDeLaPagina','Cliente eliminado exitosamente... puede continuar operando!'));
           console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteBaja] | Carga OK despues de Eliminar Cliente.-');
        });
        return;
    })
    .catch(function(err){
        console.log(err);
    })

});

app.post('/cuentaBaja', function(req,res){

   var cuenta_completa = req.body.cuenta_baja.split("%20").join(" ");
   var banco = cuenta_completa.split(" | ")[0];
   var tipo_cuenta = cuenta_completa.split(" | ")[1];
   var numero_cuenta = cuenta_completa.split(" | ")[2];

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaBaja] | Banco: |' + banco + '| Tipo Cuenta: ' + tipo_cuenta + '|Numero: ' + numero_cuenta);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaBaja] | Ingreso... ');
   var promise = libEliminarCuenta.cuentaElimina(banco, tipo_cuenta, numero_cuenta);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaBaja] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaBaja] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [cuentaBaja] | Se elimino la Cuenta: '${banco}'+'${tipo_cuenta}'+'${numero_cuenta}'`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaBaja] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
   })
   /*
   .then(function(resu){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaBaja] | Se procede a evaluar Seleccion Cuentas... ');
        //console.log("<<<<<<---------------------------------------------------->>>>>>");
        //console.log(...resu);
        resultado = resu;
        return libSeleccionarCuenta.cuentaSelecciona();
   })
   */
   .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaBaja] | ... finalizando...');

        fs.readFile(__dirname + "/html/index.html", (error, data) => {
           if(error) {
               throw error;
           }

           res.send(data.toString().split("$Clientes").join(cadena)
                                   .replace('$MensajeDeLaPagina','Cuenta dada de baja exitosamente... puede continuar operando!'));
           console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaBaja] | Carga OK despues de Eliminar Cuenta.-');
        });
        return;
    })

});


app.post('/servicioBaja', function(req,res){

   var cliente_completo = req.body.cliente_baja_servicio.split("%20").join(" ");
   var usuario = cliente_completo.split(" - ")[0];

   var servicio_completo = req.body.servicio_baja_servicio;
   var servicio = servicio_completo.split(" | ")[0];
   servicio = servicio.split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioBaja] | Cliente: |' + usuario);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioBaja] | Ingreso... ');
   var promise = libEliminarServicio.servicioElimina(servicio, usuario);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioBaja] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioBaja] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [servicioBaja] | Se elimino el Servicio: '${servicio}'+'${usuario}'`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioBaja] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
   })
   .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioBaja] | ... finalizando...');

        fs.readFile(__dirname + "/html/index.html", (error, data) => {
           if(error) {
               throw error;
           }

           res.send(data.toString().split("$Clientes").join(cadena)
                                   .replace('$MensajeDeLaPagina','Servicio dado de baja exitosamente... puede continuar operando!'));
           console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioBaja] | Carga OK despues de Eliminar Servicio.-');
        });
        return;
    })

});


app.get('/', function(req, res) {

    console.log('[' + libUtils.getDateTime() + '] | index.js [cargaInicial] | Ingreso... ');
    var promise = libSeleccionarCliente.clienteSelecciona(resultado);
    console.log('[' + libUtils.getDateTime() + '] | index.js [cargaInicial] | ... Se genero Promesa... ');

    promise
    /*
    .then(function(resu){
         console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaInserta] | Se procede a evaluar Seleccion Cuentas... ');
         //console.log("<<<<<<---------------------------------------------------->>>>>>");
         //console.log(...resu);
         resultado = resu;
         return libSeleccionarCuenta.cuentaSelecciona();
    })
    */
    .then(function(cadena){
         console.log('[' + libUtils.getDateTime() + '] | index.js [cargaInicial] | ... finalizando...');

         fs.readFile(__dirname + "/html/index.html", (error, data) => {
            if(error) {
                throw error;
            }

            res.send(data.toString().split("$Clientes").join(cadena)
                                    .replace('$MensajeDeLaPagina','Bienvenido!'));
            console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cargaInicial] | Mensaje Inicial "Bienvenido".-');
         });
         return;
     })

});


app.post('/clienteInserta', function(req,res){

   var username = req.body.username.split("%20").join(" ").trim();
   //var password = crypto.createHash('sha256').update(req.body.password).digest('base64');
   var documento = req.body.documento;
   documento = documento.split("%20").join(" ");
   var nombre = req.body.nombre;
   nombre = nombre.split("%20").join(" ");
   var apellido = req.body.apellido;
   apellido = apellido.split("%20").join(" ");
   var clave = req.body.clave;
   clave = clave.split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteInserta] | Ingreso... ');
   var promise = libInsertarCliente.clienteInserta(username,documento,nombre,apellido,clave);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteInserta] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteInserta] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [clienteInserta] | Se inserto la Persona: '${username}','${documento}','${nombre}','${apellido}','${clave}'`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteInserta] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
   })
   .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [clienteInserta] | ... finalizando...');
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteInserta] | Cadena-Clientes: ' + cadena);

        fs.readFile(__dirname + "/html/index.html", (error, data) => {
           if(error) {
               throw error;
           }

           res.send(data.toString().split("$Clientes").join(cadena)
                                   .replace('$MensajeDeLaPagina','Cliente creado exitosamente... puede continuar operando!'));
           console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [clienteInserta] | Carga OK despues de Insertar Cliente.-');
        });
        return;
    })
    .catch(function(err){
        console.log(err);
    })

});


app.post('/cuentaInserta', function(req,res){

   var cliente_completo = req.body.cliente_alta_cuenta.split("%20").join(" ");
   var banco = req.body.banco.split("%20").join(" ");
   var tipo_cuenta = req.body.tipo_cuenta;
   var numero_cuenta = req.body.numero_cuenta.split("%20").join(" ");

   var cliente = cliente_completo.split(" - ")[0];
   //cliente = cliente.split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaInserta] | Ingreso... ');
   var promise = libInsertarCuenta.cuentaInserta(cliente,banco,tipo_cuenta,numero_cuenta);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaInserta] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaInserta] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [cuentaInserta] | Se inserto la Cuenta: '${cliente}','${banco}','${tipo_cuenta}','${numero_cuenta}'`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaInserta] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
   })
   /*
   .then(function(resu){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaInserta] | Se procede a evaluar Seleccion Cuentas... ');
        //console.log("<<<<<<---------------------------------------------------->>>>>>");
        //console.log(...resu);
        resultado = resu;
        return libSeleccionarCuenta.cuentaSelecciona();
   })
   */
   .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentaInserta] | ... finalizando...');

        fs.readFile(__dirname + "/html/index.html", (error, data) => {
           if(error) {
               throw error;
           }

           res.send(data.toString().split("$Clientes").join(cadena)
                                   .replace('$MensajeDeLaPagina','Cuenta creada exitosamente... puede continuar operando!'));
           console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentaInserta] | Carga OK despues de Insertar Cuenta.-');
        });
        return;
    })
    .catch(function(err){
        console.log(err);
    })

});


app.post('/servicioInserta', function(req,res){

    var servicio = req.body.nombre_servicio.split("%20").join(" ");
    var codigo = req.body.codigo_servicio.split("%20").join(" ");
    var cliente_completo = req.body.cliente_alta_servicio.split("%20").join(" ");
    var importe = req.body.importe;

    var usuario = cliente_completo.split(' - ')[0];

    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioInserta] | Ingreso... ');
    var promise = libInsertarServicio.servicioInserta(servicio,codigo,usuario,importe);
    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioInserta] | ... Se genero Promesa...');

    promise
    .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioInserta] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [servicioInserta] | Se inserto la Cuenta: '${servicio}','${codigo}','${usuario}',${importe}`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioInserta] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
    })
    .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [servicioInserta] | ... finalizando...');

          fs.readFile(__dirname + "/html/index.html", (error, data) => {
             if(error) {
                 throw error;
           }
           res.send(data.toString().split("$Clientes").join(cadena)
                                 .replace('$MensajeDeLaPagina','Servicio creado exitosamente... puede continuar operando!'));
         console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [servicioInserta] | Carga OK despues de Insertar Servicio.-');
      });
      return;
    })
    .catch(function(err){
        console.log(err);
    })

});


app.post('/movimientoInserta', function(req,res){

    var cuenta_completa = req.body.cuenta_alta_movimiento.split("%20").join(" ");
    var importe = req.body.importe_movimiento;

    var banco = cuenta_completa.split(' | ')[0];
    var tipo_cuenta = cuenta_completa.split(' | ')[1];
    var numero_cuenta = cuenta_completa.split(' | ')[2];

    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [movimientoInserta] | Ingreso... ');
    var promise = libInsertarMovimiento.movimientoInserta(banco,tipo_cuenta,numero_cuenta,importe);
    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [movimientoInserta] | ... Se genero Promesa...');

    promise
    .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [movimientoInserta] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [movimientoInserta] | Se registro el Movimiento: '${banco}','${tipo_cuenta}','${numero_cuenta}',${importe}`);
        console.log('[' + libUtils.getDateTime() + '] | index.js [movimientoInserta] | Se procede a evaluar Seleccion Clientes... ');
        return libSeleccionarCliente.clienteSelecciona();
    })
    .then(function(cadena){
        console.log('[' + libUtils.getDateTime() + '] | index.js [movimientoInserta] | ... finalizando...');

          fs.readFile(__dirname + "/html/index.html", (error, data) => {
             if(error) {
                 throw error;
           }
           res.send(data.toString().split("$Clientes").join(cadena)
                                 .replace('$MensajeDeLaPagina','Movmiento registrado exitosamente... puede continuar operando!'));
         console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [movimientoInserta] | Carga OK despues de Insertar Movimiento.-');
      });
      return;
    })
    .catch(function(err){
        console.log(err);
    })

});


app.get('/validaUsuario', function(req, res) {

    var http = require('http');
    var url = require('url');

    var reqUrl = req.url;
    var usuario = reqUrl.split('?')[1].split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaUsuario] | Ingreso... ');
   var promise = libInsertarCliente.validaUsuario(usuario);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaUsuario] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [validaUsuario] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaUsuario] | Variable: ' + re[0][0].Salida);
        //if (re[0][0].Salida > 0) {
        //res.end(JSON.stringify('El Nombre de Usuario ' + usuario + ' ya existe; debe elegir otro.'));
        res.end(JSON.stringify(re[0][0].Salida));
        //};
        return;
    })
    .catch(function(err){
         console.log(err);
    })

})


app.get('/validaDocumento', function(req, res) {

    var http = require('http')
    var url = require('url');

    var reqUrl = req.url;
    var documento = reqUrl.split('?')[1].split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaDocumento] | Ingreso... ');
   var promise = libInsertarCliente.validaDocumento(documento);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaDocumento] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [validaDocumento] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaDocumento] | Variable: ' + re[0][0].Salida);
        //if (re[0][0].Salida > 0) {
        //res.end(JSON.stringify('El Nombre de Usuario ' + usuario + ' ya existe; debe elegir otro.'));
        res.end(JSON.stringify(re[0][0].Salida));
        //};
        return;
    })
    .catch(function(err){
         console.log(err);
    })

})


app.get('/validaCuenta', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;

   var numero_cuenta = reqUrl.split('?')[1].split("%20").join(" ");
   var banco = reqUrl.split('?')[2].split("%20").join(" ");
   var tipo_cuenta = reqUrl.split('?')[3];

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCuenta] | URL: ' + reqUrl +  '| Cuenta: ' + numero_cuenta + '|Banco: ' + banco + '|Tipo Cuenta: ' + tipo_cuenta + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCuenta] | Ingreso... ');
   var promise = libInsertarCuenta.validaCuenta(numero_cuenta, banco, tipo_cuenta);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCuenta] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [validaCuenta] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCuenta] | Variable: ' + re[0][0].Salida);

        res.end(JSON.stringify(re[0][0].Salida));

        return;
    })
    .catch(function(err){
         console.log(err);
    })

})


app.get('/validaServicio', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;
   var cliente_completo = reqUrl.split('?')[1].split("%20").join(" ");
   var servicio = reqUrl.split('?')[2].split("%20").join(" ");

   var usuario = cliente_completo.split(' - ')[0];

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaServicio] | Servicio: ' + servicio +  '| Cliente: ' + usuario + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaServicio] | Ingreso... ');
   var promise = libInsertarServicio.validaServicio(servicio, usuario);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaServicio] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [validaServicio] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaServicio] | Variable: ' + re[0][0].Salida);

        res.end(JSON.stringify(re[0][0].Salida));

        return;
    })
    .catch(function(err){
         console.log(err);
    })

})

app.get('/validaCodigoServicio', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;
   var servicio = reqUrl.split('?')[1].split("%20").join(" ");

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCodigoServicio] | Servicio: ' + servicio + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCodigoServicio] | Ingreso... ');
   var promise = libInsertarServicio.validaCodigoServicio(servicio);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCodigoServicio] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [validaCodigoServicio] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [validaCodigoServicio] | Variable: ' + re[0][0].Salida + "'");

        res.end(JSON.stringify(re[0][0].Salida));

        return;
    })
    .catch(function(err){
         console.log(err);
    })

})



app.get('/cuentasPorCliente', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;

   var cliente = reqUrl.split('?')[1].split("%20").join(" ");
   //console.log('----------------------------------------------------> ' + cliente);
   var username = cliente.split(" - ")[0].trim();
   //console.log('----------------------------------------------------> ' + username);

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | URL: ' + reqUrl +  '| Username: ' + username + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | Ingreso... ');
   var promise = libSeleccionarCuenta.cuentasPorCliente(username);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentasPorCliente] | ... evaluando Promesa');
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | Variable: ' + re[0][0].Salida);
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | Variable: ' + res.end(JSON.stringify(re[0])));

        res.end(JSON.stringify(re[0]));
        //res.send({re});
        console.log('[' + libUtils.getDateTime() + '] | index.js [cuentasPorCliente] | ... carga Combo Cuentas finalizada.-');

        return;
    })
    .catch(function(err){
         console.log(err);
    })

})


app.get('/serviciosPorCliente', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;

   var cliente_completo = reqUrl.split('?')[1].split("%20").join(" ");

   var usuario = cliente_completo.split(" - ")[0];

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [serviciosPorCuenta] | Cliente: ' + usuario + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [serviciosPorCuenta] | Ingreso... ');
   var promise = libSeleccionarServicio.serviciosPorCliente(usuario);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [serviciosPorCuenta] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [serviciosPorCuenta] | ... evaluando Promesa');
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | Variable: ' + re[0][0].Salida);
        //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [cuentasPorCliente] | Variable: ' + res.end(JSON.stringify(re[0])));

        res.end(JSON.stringify(re[0]));
        //res.send({re});
        console.log('[' + libUtils.getDateTime() + '] | index.js [serviciosPorCuenta] | ... carga Combo Servicios finalizada.-');

        return;
    })
    .catch(function(err){
         console.log(err);
    })

})


app.get('/saldoActual', function(req, res) {

   var http = require('http')
   var url = require('url');

   var reqUrl = req.url;

   var cuenta_completa = reqUrl.split('?')[1].split("%20").join(" ");

   var banco = cuenta_completa.split(" | ")[0];
   var tipo_cuenta = cuenta_completa.split(" | ")[1];
   var numero_cuenta = cuenta_completa.split(" | ")[2];

   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [saldoActual] | Banco: ' + banco +  '| Tipo Cuenta: ' + tipo_cuenta + '| Cuenta: ' + numero_cuenta + "'");
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [saldoActual] | Ingreso... ');
   var promise = libSeleccionarCuenta.saldoPorCuenta(banco,tipo_cuenta,numero_cuenta);
   console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [saldoActual] | ... Se genero Promesa...');

   promise
   .then(function(re){
        console.log('[' + libUtils.getDateTime() + '] | index.js [saldoActual] | ... evaluando Promesa');
        console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [saldoActual] | Variable: ' + re[0][0].Salida);

        res.end(JSON.stringify(re[0][0].Salida));

        return;
    })
    .catch(function(err){
         console.log(err);
    })


})



app.get('/ejecutaReporteCliente', function(req,res){

    var http = require('http')
    var url = require('url');

    var reqUrl = req.url;

    var cliente = reqUrl.split('?')[1].split("%20").join(" ");

    var username = cliente.split(" - ")[0].trim();

    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCliente] | Ingreso... ');
    var promise = libSeleccionarCliente.reporteCliente(username);
    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCliente] | ... Se genero Promesa...');

    promise
    .then(function(re){
         console.log('[' + libUtils.getDateTime() + '] | index.js [ejecutaReporteCliente] | ... evaluando Promesa');
         //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCliente] | Variable: ' + re[0][0].Salida);
         console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCliente] | Retornando valores... ');

         //res.end(JSON.stringify(re[0][0].Salida));
         res.end(JSON.stringify(re[0]));

         return;
     })
     .catch(function(err){
          console.log(err);
     })

});


app.get('/ejecutaReporteCuentas', function(req,res){

    var http = require('http')
    var url = require('url');

    var reqUrl = req.url;

    var cliente = reqUrl.split('?')[1].split("%20").join(" ");

    var username = cliente.split(" - ")[0].trim();

    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCuentas] | Ingreso... ');
    var promise = libSeleccionarCuenta.reporteCuentas(username);
    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCuentas] | ... Se genero Promesa...');

    promise
    .then(function(re){
         console.log('[' + libUtils.getDateTime() + '] | index.js [ejecutaReporteCuentas] | ... evaluando Promesa');
         //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCuentas] | Variable: ' + re[0][0].Salida);
         console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteCuentas] | Retornando valores... ');

         //res.end(JSON.stringify(re[0][0].Salida));
         res.end(JSON.stringify(re[0]));

         return;
     })
     .catch(function(err){
          console.log(err);
     })

});

app.get('/ejecutaReporteServicios', function(req,res){

    var http = require('http')
    var url = require('url');

    var reqUrl = req.url;

    var cliente = reqUrl.split('?')[1].split("%20").join(" ");

    var username = cliente.split(" - ")[0].trim();

    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteServicios] | Ingreso... ');
    var promise = libSeleccionarServicio.reporteServicios(username);
    console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteServicios] | ... Se genero Promesa...');

    promise
    .then(function(re){
         console.log('[' + libUtils.getDateTime() + '] | index.js [ejecutaReporteServicios] | ... evaluando Promesa');
         //console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteServicios] | Variable: ' + re[0][0].Salida);
         console.log('[' + libUtils.getDateTime() + '] | ' + 'index.js [ejecutaReporteServicios] | Retornando valores... ');

         //res.end(JSON.stringify(re[0][0].Salida));
         res.end(JSON.stringify(re[0]));

         return;
     })
     .catch(function(err){
          console.log(err);
     })

});


/*
app.listen(port, () => {
    console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [app.listen] | Server Started at http://localhost:${port}`);
})
*/

app.set('port', process.env.PORT || port);

app.listen(app.get('port'),() => {
    console.log('[' + libUtils.getDateTime() + '] | ' + `index.js [app.listen] | Server Started at http://localhost:${app.get('port')}`);
});
