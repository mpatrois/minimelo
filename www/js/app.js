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
                var self=this;
                var record= new Record();
                var uiMini   = new UiMini();
                var eventsMini   = new EventsMini(uiMini,record);

                ressources.loadSongs().then(function(data){
                    uiMini.initButtonsModal();
                   // console.log(ressources);
                   // // for (var i = 0; i < ressources.songsDirectories.length; i++) {
                   // //      var songDirectory=ressources.songsDirectories[i];
                   // //      console.log(songDirectory);
                   // // };
                   // for(var type in ressources.songsDirectories){
                   //      if(type!=null)
                   //      {
                   //          var songDirectory=ressources.songsDirectories[type];
                   //          var song=songDirectory[0];

                   //          var buttonSong=$('<div class="button instrument"></div>');
                   //          buttonSong.attr('data-song-id', song.id);
                   //          buttonSong.attr('type',type);
                   //          $('#buttons-songs').append(buttonSong);
                   //      }
                   // }
                });
                uiMini.initUiMini();
                eventsMini.initEventsMini();     
            }
        };


        // application.init();

        application.onDeviceReady();
    });


});
