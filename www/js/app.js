requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib',
        impl:'../js/app/impl',
    }
});

function success(entries) {
    var i;
    for (i=0; i<entries.length; i++) {
        console.log(entries[i].name);
    }
}

function fail(error) {
    alert("Failed to list directory contents: " + error.code);
}



$(document).ready(function() {

    require(['app/Timeline', 'app/Utils','app/UiMini','app/EventsMini','app/ResourcesHandler','app/Record'], function(Timeline, Utils, UiMini,EventsMini,ressources,Record) {

        'use strict';

        navigator.getUserMedia = navigator.getUserMedia ||
                             navigator.webkitGetUserMedia ||
                             navigator.mozGetUserMedia;

        var application = {

            init : function () {
                document.addEventListener("deviceready", this.onDeviceReady, false);
            },

            onDeviceReady : function () {

                ressources.loadSongs();
                var record= new Record();
                var uiMini   = new UiMini();
                var eventsMini   = new EventsMini(uiMini,record);
                uiMini.initUiMini();
                eventsMini.initEventsMini();

               window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSystem) {
                   fileSystem.root.getDirectory("/", {
                           create: true
                       }, function(directory) {

                        var directoryReader = directory.createReader();
                        directoryReader.readEntries(function(entries) {
                            var i;
                            for (i=0; i<entries.length; i++) {
                                console.log(entries[i].name);
                            }
                        }, function (error) {
                            alert(error.code);
                        });

                       } );
                }, function(error) {
                   alert("can't even get the file system: " + error.code);
                });


                
            }
        };


        // application.init();

        application.onDeviceReady();
    });


});
