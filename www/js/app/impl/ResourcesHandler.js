define(function(require){
	'use strict';

	function errorHandler() { console.log("An error occurred"); }

	function ResourcesHandler() {
		this.songs  = [];
	};

	ResourcesHandler.prototype.loadFiles = function() {

	    window.resolveLocalFileSystemURL(cordova.file.dataDirectory, gotFS, fail);

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
	    }

	};

	ResourcesHandler.prototype.getInstance = function() {
		return this;
	};

	return ResourcesHandler;
});
