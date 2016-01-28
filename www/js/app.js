requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib'
    }
});

$(document).ready(function() {

    require(['app/Timeline', 'app/Utils','app/UiMini'], function(Timeline, Utils, UiMini) {

        'use strict';

        var timeline = new Timeline();
        var uiMini   = new UiMini(timeline);

        function onDeviceReady() {
            debug(navigator.device.capture);
        }

        function runApp(){
            document.addEventListener("deviceready", onDeviceReady, false);

            uiMini.initUiMini();
            
        }

        runApp();

    });

});
