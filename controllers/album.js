'use strict'
var fs = require("fs");
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
	var albumId = req.params.id;

	Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
		if(err){
				res.status(500).send({message:'Error en la petición'});
		}else{
			if(!album){
				res.status(404).send({message:'El album no existe'});
			}else{
				res.status(200).send({album});
			}

		}
	});

}

function saveAlbum(req, res){
	var album = new Album();

	var params = req.body;
	album.title = params.title;
	album.description = params.description;
	album.year = params.year;
	album.image = 'null';
	album.artist = params.artist;

	album.save((err, albumStored) => {
		if(err){
				res.status(500).send({message:'Error al guardar el album'});
		}else{
			if(!albumStored){
				res.status(404).send({message:'El album no ha sido guardado'});
			}else{
				res.status(200).send({album: albumStored});
			}
		}
	});

}

function getAlbums(req, res){
	var artistId = req.params.artist;

	if(!artistId){
		// Obtener todos los albums de la Base de Datos
				res.status(404).send({message:'No hay artistas :('});
				var find = Album.find({}).sort('title');
			}else{
		// Obtener los albums de un artista determinado de la Base de Datos
				var find = Album.find({artist: artistId}).sort('year');				
			}

			find.populate({path: 'artist'}).exec((err, albums) => {
				if(err){
					res.status(500).send({message:'Error en la petición'});
				}else{
					if(!albums){
						res.status(404).send({message:'No hay albums :('});
					}else{
						res.status(200).send({albums});
					}
				}
			});

	

}


module.exports = {
	getAlbum,
	saveAlbum,
	getAlbums
};