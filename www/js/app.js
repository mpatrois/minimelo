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

            runApp:function(){
                 var record= new Record();
                var uiMini   = new UiMini();
                var eventsMini   = new EventsMini(uiMini,record);
                uiMini.initUiMini();
                eventsMini.initEventsMini();
                console.log(ressources.typeDirectories.length,"application runned");
                console.log(ressources.songs,"songs");
            },

            onDeviceReady : function () {
                ressources.initApplication=this.runApp;
                ressources.loadSongs();                
            }
        };


        // application.init();

        application.onDeviceReady();
    });


});
