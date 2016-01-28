define(function( require ) {

  'use strict';

  function Song(){
    this.buffer    = null;
    this.source    = null;
    this.startTime = 0;
    this.stopTime  = 0;
  }

  Song.prototype.playWithTime = function ( time, audioCtx ) {
    this.source        = audioCtx.createBufferSource();
    this.source.buffer = this.buffer;
    this.source.connect(audioCtx.destination);
    this.source.start(audioCtx.currentTime+time);
    return this.source;
  };

  Song.prototype.play = function ( audioCtx )
  {
    this.playWithTime(0, audioCtx);
  };

  // Song.prototype.stop = function ()
  // {
  //   if(this.source!=null && this.playing)
  //     this.source.stop();
  // };

  Song.prototype.getDuration = function (){
    return this.source.buffer.duration;
  };

  return Song;

});

