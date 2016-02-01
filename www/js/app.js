requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib',
        impl:'../js/app/impl',
    }
});

// $(document).ready(function() {

    require(['app/Resources', 'app/UiMini'], function(resources, UiMini) {

        'use strict';

        var uiMini      = new UiMini();

        var application = {

            init : function () {
                document.addEventListener("deviceready", this.onDeviceReady, false);

            },

            onDeviceReady : function () {
                //resources.loadFiles();
                uiMini.initUiMini();
            }
        };


        application.init();

    });

// });*/
