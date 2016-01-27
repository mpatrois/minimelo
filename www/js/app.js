requirejs.config({
    baseUrl: 'lib',
    paths: {
        app: '../js/app',
        lib: '../js/lib'
    }
});

$(document).ready(function() {
    require(['app/Timeline', 'app/Utils'], function(Timeline, Utils) {

        'use strict';

        var timeline = new Timeline();

        function runApp(){

            $(".round_btn.trash_btn").click(function(){
                $('.box').empty();
            });

            $(".plus_instru").click(function() {
                $(".overlay").toggleClass('active');
            });

            for (var i = 0; i < ressources.length; i++) {

                var divSong=$('<div class="files button instrument"></div>');
                divSong.attr('type',ressources[i].type);
                divSong.attr('data-song-url',ressources[i].url);
                divSong.attr('data-song-id',i);

                $('#files-list').append(divSong);

                timeline.loadSong(i,ressources[i].url);
            };

            $(".files.button").click(function(){
                $(".files.button").removeClass("active");
                $(this).addClass("active");
            })


            $('.piste').each(function(){
                for (var i = 0; i < 30; i++) {
                    $(this).append('<div class="box"></div>');
                };

                $(this).css('width',60*30);
            });

            $('.files').mousedown(function(event){
                var idSong = $(this).attr("data-song-id");
                timeline.songs[idSong].play(timeline.audioCtx);    
            });

            $('#play').click(function() {
                timeline.play();
            });

            $('.files').mousedown(function(event){

                var url              = $(this).attr('data-song-url');
                var request          = new XMLHttpRequest();
                request.responseType = 'arraybuffer';
                request.open('GET', url, true);

                request.onload = function() {
                    timeline.audioCtx.decodeAudioData(request.response, function(buffer) {
                        var source    = timeline.audioCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(timeline.audioCtx.destination);
                        source.start();
                    }, function(e) {"Error with decoding audio data" + e.err;});
                }
                request.send();
            });

            $('.box').off().on('click', function(e){
                e.preventDefault();
                var button=$(".files.button.active")[0];

                if($(this).find('.instrument')[0] == null && button != null) {
                    var clone=$("<div class='instrument'></div>");
                    clone.attr('type',$(button).attr('type'));
                    clone.attr('data-song-id',$(button).attr('data-song-id'));
                    $(this).append(clone);
                } else {
                    $(this).empty();
                }

            });

        }

        runApp();

    });

});
