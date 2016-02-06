requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib',
        impl:'../js/app/impl',
    }
});

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
                
            }
        };


        // application.init();

        application.onDeviceReady();
    });


});
