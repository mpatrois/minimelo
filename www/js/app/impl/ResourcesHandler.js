define(function( require ){

	var Song       = require('app/Song');
	var Utils      = require('app/Utils');
	var ressources = require('app/ressources');

	'use strict';

	function ResourcesHandler() {
		this.songs    = [];
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


	};

	ResourcesHandler.prototype.loadTestSongs = function() {

		for ( var classe in ressources )
		{
			for ( var song in ressources[classe] )
			{
				this.songs.push(new Song(classe, ressources[classe][song].url));
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

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	};

	return ResourcesHandler;
});
