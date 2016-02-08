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
		this.filesDirectories = {};
		this.songsDirectories = {};
		this.numberDirectories=0;
		this.numberDirectoriesReaded=0;
		this.initApplication=null;
		this.sourceInPreview=null;
	}




	ResourcesHandler.prototype.playPreview=function(idSong){
		this.songs[idSong].playForPreview().then(function(source){
			if(this.sourceInPreview!=null){
				this.sourceInPreview.stop();
			}
			this.sourceInPreview=source;
			var self=this;
			this.sourceInPreview.onended=function(){
				self.sourceInPreview=null;
			};
		});
	}

	ResourcesHandler.prototype.loadSongs = function() {

		var self=this;
		if (true)
		{

			return new Promise(function (resolve, reject) {
			
				window.resolveLocalFileSystemURL("file:///sdcard/Android/data/com.phonegap.minimelo/files",resolve,reject);
			
			}).then(function(fileSystem){
				directoryReader = fileSystem.createReader();

				return new Promise(function(resolve,reject){
					directoryReader.readEntries(resolve,reject);
				});

			}).then(function(directories){
				var promises=[];
				for (var i = 0; i < directories.length; i++) {
					var directory=directories[i];
					var reader=directory.createReader();
					directory.files=[];
					self.songsDirectories[directory.name]=[];

					var promise=new Promise(function(resolve,reject){
						reader.readEntries(resolve.bind(directory),reject);
					});
					promise.then(function(files){
						for (var j = 0; j < files.length; j++) {
							var file=files[j];
	            			this.files.push(file);

	            			var song=new Song(this.name,file.nativeURL);
							song.fileEntry=file;
							self.songs.push(song);
							self.songsDirectories[this.name].push(song);
	            		};
	            		self.filesDirectories[this.name] = this;
					}.bind(directory));

					promises.push(promise);

				};
				
				return Promise.all(promises);

			});
			// window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	
		 //    var directoryReader = fileSystem.createReader();
			//     directoryReader.readEntries(function(directories) {
			//         var i;
			//         for (i=0; i<directories.length; i++) {
			//             if(directories[i].isDirectory===true){
			//             	var directory=directories[i];
			//             	var reader = directory.createReader();

			//             	directory.filesList=[];
			//             	reader.readEntries(function(files) {
			//             		for (var j = 0; j < files.length; j++) {
			//             			this.filesList.push(files[j]);           			      			
			//             		};
			//             		self.callbackDirectoryReaded(this);
			//             	}.bind(directory));
			//             }
			//         }
			//         self.callbackDirectories(directories.length);

			//     }, function (error) {
			//         console.log(error);
			//     });

			// }, function(error){
			// 	console.log(error);
			// });

		}
		else {
			this.loadTestSongs();
		}


	}

	ResourcesHandler.prototype.loadTestSongs = function() {

		var self = this;
		for ( var type in ressources )
		{
			var songsOfType=ressources[type];
			for ( var i in songsOfType )
			{
				var urlSong=songsOfType[i];
				self.songs.push(new Song(type,urlSong));
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

	// ResourcesHandler.prototype.currentSongs = function() {
	// 	var currentSongs = [];

	// 	for ( var song in this.songs )
	// 	{
	// 		console.log(this.songs[song].loaded());
	// 		if (this.songs[song].loaded() == true) {
	// 			currentSongs.push( song );
	// 		}
	// 	}
	// 	console.log('currentSongs',this);
	// 	console.log('currentSongs',this);
	// 	return currentSongs;
	// }

	ResourcesHandler.prototype.getSongs = function() {
		return this.songs;
	}

	ResourcesHandler.prototype.getIdFirstSongType = function(type) {
		var found = false;
		var id 	  = 0;

		while ( found == false && id < this.songs.length)
		{
			if ( this.songs[id].type == type)
			{
				found = true;
			}
			id++;
		}
		if(found)
			return id-1;
		else
			return -1;
	}

	ResourcesHandler.prototype.getIdFirstSongUrl = function(url) {
		var found = false;
		var id 	  = 0;

		while ( found == false && id < this.songs.length)
		{
			if ( this.songs[id].url == url)
			{
				found = true;
			}
			id++;
		}
		if(found)
			return id-1;
		else
			return -1;
	}

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	}

	ResourcesHandler.prototype.getTypes=function(){
		return Object.keys(this.songsDirectories);
	}

	return ResourcesHandler;
});
