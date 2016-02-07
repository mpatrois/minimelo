# Mini Mélo

Mini Mélo is an educational app for recognizing and playing with sounds. You can use the defaults sounds or record your voice or sounds to play with them too !

## How to install ?

### On cordova

	cordova platform add android

### On phonegap

	phonegap platform add android

Then run : 

	cordova/phonegap run android

##How to use scss and gulp
	install gulp in your minimelo/www directory by running
	$ npm install gulp
	
	then run 
	$ gulp


Notes
adb shell
run-as com.phonegap.minimelo


window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                   fileSystem.root.getDirectory("/Music", {
                           create: true
                       }, function(directory) {

                        var directoryReader = directory.createReader();
                        directoryReader.readEntries(function(entries) {
                            var i;
                            for (i=0; i<entries.length; i++) {
                                console.log(entries[i]);
                            }
                        }, function (error) {
                            alert(error.code);
                        });

                       } );
                }, function(error) {
                   alert("can't even get the file system: " + error.code);
                });


create 8 directory

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
   
   for (var i = 0; i < 8; i++) {
       fileSystem.root.getDirectory("type-"+i, {
               create: true
           }, function(directory) {

		} );
	};
},
function(error) {
   alert("can't even get the file system: " + error.code);
});


window.resolveLocalFileSystemURL("file:///sdcard/Music/", function (fileSystem) {
	console.log(fileSystem);
	window.Flags=fileSystem;
}, function(error){
	console.log(error);
});

window.resolveLocalFileSystemURL("file:///sdcard/Music/", function (fileSystem) {
	fileSystem.root.getDirectory("/Music", {
                           create: true
                       }, function(directory) {

                        var directoryReader = directory.createReader();
                        directoryReader.readEntries(function(entries) {
                            var i;
                            for (i=0; i<entries.length; i++) {
                                console.log(entries[i]);
                            }
                        }, function (error) {
                            alert(error.code);
                        });

                       } );
}, function(error){
	console.log(error);
});

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                   fileSystem.root.getDirectory("/Music", {
                           create: true
                       }, function(directory) {

                        var directoryReader = directory.createReader();
                        directoryReader.readEntries(function(entries) {
                            var i;
                            for (i=0; i<entries.length; i++) {
                                console.log(entries[i]);
                            }
                        }, function (error) {
                            alert(error.code);
                        });

                       } );
                }, function(error) {
                   alert("can't even get the file system: " + error.code);
                });

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
	console.log(fileSystem);
                   fileSystem.root.getDirectory("/", {
                           create: false
                       }, function(directory) {

                        var directoryReader = directory.createReader();
                        directoryReader.readEntries(function(entries) {
                            var i;
                            for (i=0; i<entries.length; i++) {
                                console.log(entries[i]);
                            }
                        }, function (error) {
                            alert(error.code);
                        });

                       } );
                }, function(error) {
                   alert("can't even get the file system: " + error.code);
                });

window.resolveLocalFileSystemURL("file:///sdcard/Music/", function (fileSystem) {
	console.log(fileSystem.filesystem);
	window.Flags=fileSystem;

	fileSystem.filesystem.root.getDirectory("/sdcard/Music", {
       create: false
   }, function(directory) {

    var directoryReader = directory.createReader();
	    directoryReader.readEntries(function(entries) {
	        var i;
	        for (i=0; i<entries.length; i++) {
	            console.log(entries[i]);
	        }
	    }, function (error) {
	        alert(error.code);
	    });

   } );


}, function(error){
	console.log(error);
});

window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	console.log(fileSystem.filesystem);
	window.Flags=fileSystem;

    var directoryReader = fileSystem.createReader();
	    directoryReader.readEntries(function(entries) {
	        var i;
	        for (i=0; i<entries.length; i++) {
	            console.log(entries[i]);
	        }
	    }, function (error) {
	        alert(error.code);
	    });

}, function(error){
	console.log(error);
});

window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	console.log(fileSystem.filesystem);
	window.Flags=fileSystem;

    var directoryReader = fileSystem.createReader();
	    directoryReader.readEntries(function(directories) {
	        var i;
	        for (i=0; i<directories.length; i++) {
	            if(directories[i].isDirectory===true){
	            	var directory=directories[i];
	            	var reader = directory.createReader();

	            	console.log(directory);
	            	reader.readEntries(function(files) {
	            		for (var j = 0; j < files.length; j++) {
	            			console.log(files[j]);
	            			console.log(reader);
	            		};
	            	});
	            }
	        }
	    }, function (error) {
	        alert(error.code);
	    });

}, function(error){
	console.log(error);
});


window.resolveLocalFileSystemURL("file:///sdcard/Music/minimelo", function (fileSystem) {
	console.log(fileSystem.filesystem);
	window.Flags=fileSystem;

    var directoryReader = fileSystem.createReader();
	    directoryReader.readEntries(function(directories) {
	        var i;
	        for (i=0; i<directories.length; i++) {
	            if(directories[i].isDirectory===true){
	            	var directory=directories[i];
	            	//var reader = directory.createReader();

	            	console.log(directory.name);
	            	// reader.readEntries(function(files) {
	            	// 	for (var j = 0; j < files.length; j++) {
	            	// 		console.log(files[j]);
	            	// 	};
	            	// });


	            	directory.getFile("readme.wav", {create: true, exclusive: false}, function(fileEntry){
						
						fileEntry.createWriter(function(writer){
							writer.onwriteend=function(evt){
								console.log("audio enregistre");
							}
							writer.write("coucou");
						}, fail);

					}, fail);
	            }
	        }
	    }, function (error) {
	        alert(error.code);
	    });

}, function(error){
	console.log(error);
});


// function displayDirectoryFile(i) {
//     return function() { console.log("My value: " + i); };
// }

function displayDirectoryFile(i) {
    return function(files) {
	            		for (var j = 0; j < files.length; j++) {
	            			console.log(files[j]);
	            			console.log(reader);
	            		};
	}
}

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
	            			console.log(files[j]);
	            			this.filesList.push(files[j]);           			
	            			console.log(this);          			
	            		};
	            	}.bind(directory));
	            }
	        }
	    }, function (error) {
	        alert(error.code);
	    });

}, function(error){
	console.log(error);
});
