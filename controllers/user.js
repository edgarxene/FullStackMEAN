'use strict'
var bcrypt = require('bcrypt-nodejs');
var fs = require("fs");
var path = require('path');
var User = require('../models/user');
var jwt = require('../services/jwt');


function pruebas(req, res){
	res.status(200).send({
		message:'Probando una accion del controlador Usuario'
	});
}

function saveUser(req, res){
	var user = new User();

	var params = req.body;
	//console.log(params);

	user.name = params.name;
	user.surname = params.surname;
	user.email = params.email;
	user.role = 'ROLE_ADMIN';
	user.image = 'null';

	if(params.password){
		//Encriptar contraseña y guardar
		bcrypt.hash(params.password, null, null, function(err,hash){
			user.password = hash;
			if(user.name != null && user.surname != null && user.email != null){
				//Guardar usuario en BD
				user.save((err, userStored) => {
					if(err){
						res.status(500).send({message: 'Error al guardar el usuario'});
					}else{
						if(!userStored){
							res.status(404).send({message: 'No se ha registrado el usuario'});
						}else{
							res.status(200).send({user: userStored});
						}
					}
				})

			}else{
				res.status(200).send({message: 'Rellena todos los campos'});
			}

		});
	}else{
		res.status(200).send({message: 'Introduce la contraseña'});
	}

}

function loginUser(req, res){
	var params = req.body;

	var email = params.email;
	var password = params.password;

	User.findOne({email: email.toLowerCase()}, (err, user) => {
		if(err){
			res.status(500).send({message: 'Error en la petición'});
		}else{
			if(!user){
				res.status(404).send({message: 'El usuario no existe'});
			}else{
				//Comprobar la contraseña
				bcrypt.compare(password, user.password, function(err, check){
					if(check){
						//Retornar los datos del usuario logeado
						if(params.gethash){
							//devolver un token de jwt
							res.status(200).send({
								token: jwt.createToken(user)
							});


						}else{
							res.status(200).send({user});
						}
					}else{
						res.status(500).send({message: 'El usuario no ha podido logearse'});
					}
				});

			}
		}
	});

}


	function updateUser(req, res){
		var userId = req.params.id;
		var update = req.body;

		User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
			if(err){
				res.status(500).send({message: 'Error al actualizar el usuario'});
			}else{
				if(!userUpdated){
					res.status(404).send({message: 'No se ha podido actualizar el usuario'});
				}else{
					res.status(200).send({user: userUpdated});
				}
			}
		});
	}


function uploadImage(req, res){
		var userId = req.params.id;
		var fileName = 'No cargado...';
			if(req.files){
				var file_path = req.files.image.path;
				console.log(file_path);
				var file_split = file_path.split('\\');
				var file_name = file_split[2];
				var ext_split = file_name.split('\.');
				var file_ext = ext_split[1];

				if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
					User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
					if(!userUpdated){
							res.status(404).send({message: 'No se ha podido actualizar el usuario'});
						}else{
							res.status(200).send({user: userUpdated});
					}
				});

			}else{
					res.status(404).send({message: 'Extencion del archivo no valida'});
				}

			}else{
					res.status(404).send({message: 'No has subido ninguna imagen....'});
				}
	}


function getImageFile(req, res){
	var imageFile = req.params.imageFile;
	var path_file = './uploads/users/'+imageFile;
	if(fs.existsSync(path_file)) {
    	res.sendFile(path.resolve(path_file));
  }else{
  res.status(200).send({message: 'El archivo no existe'});
  }
}

module.exports = {
	pruebas,
	saveUser,
	loginUser,
	updateUser,
	uploadImage,
	getImageFile
};