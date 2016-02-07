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
		this.typeDirectories = [];
		this.songsDirectories = {};
		this.numberDirectories=0;
		this.numberDirectoriesReaded=0;
		this.initApplication=null;
	}

	function callback(name){
		console.log(name)
	}
	ResourcesHandler.prototype.callbackDirectories=function(numberDirectories){
		this.numberDirectories=numberDirectories;
	}
	ResourcesHandler.prototype.callbackDirectoryReaded=function(directory){
		this.songsDirectories[directory.name] = directory;
		var nbDirReaded=Object.keys(this.songsDirectories).length;
		if(this.numberDirectories==nbDirReaded){
			for(var type in this.songsDirectories){
				var directory=this.songsDirectories[type];
				var filesOfDirectory=directory.filesList;
				for (var i = 0; i < filesOfDirectory.length; i++) {
					var file=filesOfDirectory[i];
					var song=new Song(type,file.nativeURL);
					song.fileEntry=file;
					this.songs.push(song);
				};
			}
			
			this.initApplication();
		}
	}

	ResourcesHandler.prototype.loadSongs = function() {

		var self=this;
		if (true)
		{
			window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	
		    var directoryReader = fileSystem.createReader();
			    directoryReader.readEntries(function(directories) {
			        var i;
			        for (i=0; i<directories.length; i++) {
			            if(directories[i].isDirectory===true){
			            	var directory=directories[i];
			            	var reader = directory.createReader();

			            	directory.filesList=[];
			            	reader.readEntries(function(files) {
			            		for (var j = 0; j < files.length; j++) {
			            			this.filesList.push(files[j]);           			      			
			            		};
			            		self.callbackDirectoryReaded(this);
			            	}.bind(directory));

			            	self.typeDirectories.push(directory);
			            	console.log(self.typeDirectories);
			            	//callback(directory.name);
			            }
			        }
			        self.callbackDirectories(directories.length);

			    }, function (error) {
			        alert(error.code);
			    });

			}, function(error){
				console.log(error);
			});

			console.log(self.typeDirectories);
			console.log(self.typeDirectories.length);


			for (var i = 0; i < self.typeDirectories.length; i++) {
				console.log(self.typeDirectories[i]);
				var songsFiles=self.typeDirectories[i].filesList;

				console.log(self.typeDirectories[i].name);
				for (var j = 0; j < songsFiles.length; j++) {
					console.log(songsFiles[j]);
				};
			};

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

	return ResourcesHandler;
});
