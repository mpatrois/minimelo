requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib',
        impl:'../js/app/impl',
    }
});

$(document).ready(function() {

    require(['app/ResourcesHandler', 'app/UiMini'], function(resources, UiMini) {

        'use strict';

        var uiMini      = new UiMini();

        var application = {

            init : function () {
                document.addEventListener("deviceready", this.onDeviceReady, false);
            },

            onDeviceReady : function () {

                resources.loadSongs();
                uiMini.initUiMini();
                
            }
        };


        // application.init();

        application.onDeviceReady();
    });


});
