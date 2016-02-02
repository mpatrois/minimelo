define(function( require ) {

    'use strict';

    function Song( id, url,audioCtx ){
        this.id        = id
        this.buffer    = null;
        this.source    = null;
        this.startTime = 0;
        this.stopTime  = 0;
        this.load( url,audioCtx );
        this.audioCtx=audioCtx;
    }

    Song.prototype.load = function ( url,audioCtx ) {
        var self = this;

        $.ajax({
            url: url,
            xhrFields : {responseType : 'arraybuffer'},
        }).done(function(arrayBuffer){

            self.audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
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
      this.source        = this.audioCtx.createBufferSource();
      this.source.buffer = this.buffer;
      this.source.connect(this.audioCtx.destination);
      this.source.start(this.audioCtx.currentTime+time);
      return this.source;
    };

    Song.prototype.play = function ()
    {
        this.playWithTime(0);
    };

    Song.prototype.getDuration = function (){
        return this.source.buffer.duration;
    };

    return Song;

});

