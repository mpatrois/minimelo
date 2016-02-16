define(function( require ){

	'use strict';

	var Song         = require('app/Song');
	var Utils        = require('app/Utils');
	var FilesHandler = require('app/FilesHandler');


	// distinction between not indexed and not classified ( ie usable sounds that are not in a collection )
	var unwantedTypes     = ['indefini', 'save', 'record'];
	var unclassifiedTypes = ['indefini', 'record'];
	
	var audioCtx    = new AudioContext();

	function ResourcesHandler() {
		this.songs           = [];
		this.songsByType     = {};

		this.sourceInPreview = null;
		this.filesHandler    = new FilesHandler();
		this.songInPreview   = null;
	}

	ResourcesHandler.prototype.postProcessing = function () {

		this.songs.sort(compare);

		for (var index in this.songs) {
			var song = this.songs[index];
			if(this.songsByType[song.type] == undefined)
				this.songsByType[song.type] = [];
			this.songsByType[song.type].push(song);
		}

	}

	ResourcesHandler.prototype.playPreview = function(idSong) {

		if(this.sourceInPreview != null) {
			this.sourceInPreview.stop();
		}
		this.songInPreview=this.getSong(idSong);

		if(this.songInPreview.buffer != null) {
			this.sourceInPreview = this.getSong(idSong).play();
		} else {
			var self = this;

			this.songInPreview.loadForPreview().then( function(song) {
				if(song==self.songInPreview){
					self.sourceInPreview = song.play();
				}
				self.buffer=null;
			});
		}
	}

	ResourcesHandler.prototype.loadSong = function( id ) {
		this.getSong(id).load();
	}

	ResourcesHandler.prototype.getSongs = function() {
		return this.songs;
	}

	ResourcesHandler.prototype.getTypes = function() {
		return Object.keys(this.songsByType);
	}

	ResourcesHandler.prototype.getActivesTypes = function() {

		var actives = this.getTypes().filter(function(x) {
			return unwantedTypes.indexOf(x) < 0;
		});

		return actives;
	}

	// todo : need to fix this to avoid unnecessary redundant calculus
	ResourcesHandler.prototype.getActivesCollections = function() {

		var actives = {};

		for ( var type in this.songsByType ) {
			if( unwantedTypes.indexOf( type ) < 0 )
				actives[type] = this.songsByType[type];
		}

		return actives;
	}

	// todo : need to fix this to avoid unnecessary redundant calculus
	ResourcesHandler.prototype.getNotClassifiedCollections = function() {

		var notClassified = {};

		for ( var type in this.songsByType ) {
			if( !(unclassifiedTypes.indexOf( type ) < 0) )
				notClassified[type] = this.songsByType[type];
		}

		return notClassified;
	}

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	}

	ResourcesHandler.prototype.getSong = function ( id ) {
		var length = this.songs.length;
		for (var i = length - 1; i >= 0; i--) {
			if( this.songs[i].id == id )
				return this.songs[i];
		}
		return null;
	}

	return ResourcesHandler;
});