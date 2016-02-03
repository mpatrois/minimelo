requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib'
    }
});



// $(document).ready(function() {

    require(['app/Timeline', 'app/Utils','app/UiMini','app/EventsMini'], function(Timeline, Utils, UiMini,EventsMini) {

        'use strict';

        var timeline = new Timeline();
        var uiMini   = new UiMini(timeline);
        var eventsMini   = new EventsMini(timeline,uiMini);

        var application = {

            init : function () {
                document.addEventListener("deviceready", this.onDeviceReady, false);

                uiMini.initUiMini();
                eventsMini.initEventsMini();
            },

            onDeviceReady : function () {
            }
        };


        application.init();

    });

// });*/
