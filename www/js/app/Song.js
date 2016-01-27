define(function( require ) {

  'use strict';

  function Song(){
    this.buffer    = null;
    this.source    = null;
    this.startTime = 0;
    this.stopTime  = 0;
  }

  Song.prototype.playWithTime = function playWithTime( time, audioCtx ) {
    this.source        = audioCtx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(audioCtx.destination);
    this.source.start(audioCtx.currentTime+time);
  };

  Song.prototype.play = function play( audioCtx )
  {
    this.playWithTime(0, audioCtx);
  };

  Song.prototype.getDuration = function getDuration(){
    return this.source.buffer.duration;
  };

  return Song;

});

