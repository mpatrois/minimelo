define(function( require ){

	var Song       = require('app/Song');
	var Utils      = require('app/Utils');
	var ressources = require('app/ressources');

	var audioCtx   = new (window.AudioContext || window.webkitAudioContext)();

	'use strict';

	function ResourcesHandler() {
		this.songs      = [];
		this.loadedOnes = 0;
		this.loadable   = 0;
	}

	ResourcesHandler.prototype.loadSongs = function() {


		if (false)
		{} // si on récupère pas la liste du prof
		/*window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotFS, fail);

		function gotFS(fileSystem) {
			console.log(fileSystem); // what is this shit please ?
			fileSystem.root.getFile("readme.txt", {create: true, exclusive: false}, gotFileEntry, fail);
		}

		function gotFileEntry(fileEntry) {
			fileEntry.createWriter(gotFileWriter, fail);
		}

		function gotFileWriter(writer) {
			writer.onwriteend = function(evt) {
				console.log("contents of file now 'some sample text'");
				writer.truncate(11);
				writer.onwriteend = function(evt) {
					console.log("contents of file now 'some sample'");
					writer.seek(4);
					writer.write(" different text");
					writer.onwriteend = function(evt){
						console.log("contents of file now 'some different text'");
					}
				};
			};
			writer.write("some sample text");
		}

		function fail(error) {
			console.log(error.code);
		}*/
		else {
			this.loadTestSongs();
		}


	}

	ResourcesHandler.prototype.loadTestSongs = function() {

		var self = this;
		for ( var type in ressources )
		{
			for ( var urlValue in ressources[type].songs )
			{
				self.songs.push(new Song(type, ressources[type].songs[urlValue]));
				/*$.ajax({
					url: ressources[type].songs[urlValue],
					xhrFields : {responseType : 'arraybuffer'},
					context : { url : ressources[type].songs[urlValue] }
				}).done(function(arrayBuffer){
					var url = this.url;
					audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
						console.log("hi");
				  	}, function(e) {  } );  
				});*/
			}
		}
	}

	ResourcesHandler.prototype.getSong = function( id ) {

		for ( var song in this.songs )
		{
			if (this.songs[song].id == id) {
				return this.songs[song];
			}
		}

		return null;
	}

	ResourcesHandler.prototype.currentSongs = function() {
		var currentSongs = [];

		for ( var song in this.songs )
		{
			if (song.loaded == true) {
				currentSongs.push( song );
			}
		}

		return currentSongs;
	}

	ResourcesHandler.prototype.getSongs = function() {
		return this.songs;
	}

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	}

	return ResourcesHandler;
});
