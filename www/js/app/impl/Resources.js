define(function(require){
	'use strict';

	var lastId = 0;
	var nextInstId = 0;

	function errorHandler() { console.log("An error occurred"); }

	function Resources() {
		this.id       = lastId++;
	};

	Resources.prototype.loadFiles = function() {
		console.log(cordova.file.dataDirectory);

		var fileSystem = window.requestFileSystem(LocalFileSystem);

		var file = fileSystem.root.getFile("data" + "lockfile.txt", {create: true, exclusive: true});

		cordova.file.dataDirectory.getFile('log.txt', {create: true}, function(file) {

			// Create a FileWriter object for our FileEntry (log.txt).
			file.createWriter(function(fileWriter) {

				fileWriter.onwriteend = function(e) {
					console.log('Write completed.');
				};

				fileWriter.onerror = function(e) {
					console.log('Write failed: ' + e.toString());
				};

				// Create a new Blob and write it to log.txt.
				var bb = new BlobBuilder(); 
				// Note: window.WebKitBlobBuilder.
				bb.append('Meow');

				fileWriter.write(bb.getBlob('text/plain'));

			}, errorHandler);

		}, errorHandler);

	};

	Resources.prototype.getInstance = function() {
		return this;
	};

	return Resources;
});
