define(function( require ) {

    'use strict';

    // var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    var lastId = 0;

    function Song( url ){
        this.id        = lastId++;
        this.url       = url;
        this.buffer    = null;
        this.source    = null;
        this.startTime = 0;
        this.stopTime  = 0;
    }

    Song.prototype.load = function ( ) {
        var self = this;

        $.ajax({
            url: self.url,
            xhrFields : {responseType : 'arraybuffer'},
        }).done(function(arrayBuffer){

            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
                self.buffer = buffer;

                $("[data-song-id=" + self.id + "]").mousedown(function(){
                    self.play();
                    $("#buttons-songs .button").removeClass("active");
                    $(this).addClass("active");
                });

          }, function(e) {"Error with decoding audio data" + e.err;} );  
        });

    }

    Song.prototype.playWithTime = function ( time ) {
        this.source        = audioCtx.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(audioCtx.destination);
        this.source.start(audioCtx.currentTime + time);
    };

    Song.prototype.play = function ()
    {
        this.playWithTime(0);
    };

    Song.prototype.playOnce = function () 
    {
        var self = this;

        $.ajax({
            url: self.url,
            xhrFields : {responseType : 'arraybuffer'},
        }).done(function(arrayBuffer){

            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {

                self.source        = audioCtx.createBufferSource();
                self.source.buffer = buffer;
                self.source.connect(audioCtx.destination);
                self.source.start(audioCtx.currentTime);

          }, function(e) {"Error with decoding audio data" + e.err;} );  
        });
    };

    Song.prototype.getDuration = function (){
        return this.source.buffer.duration;
    };

    return Song;

});

