'use strict'

var mongoose = require('mongoose');
var app= require('./app')
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/fullstackmean',(err, res) =>{
	if(err){
		throw err;
	}else{
		console.log("Conexion a la base de datos exitosa");
		app.listen(port, function(){
				console.log("Servidor de musica escuchando por el puerto: " + port)
		});
	}
});


