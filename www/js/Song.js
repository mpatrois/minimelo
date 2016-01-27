function Song(){
  this.buffer=null;
  this.source=null;
  this.statTime=0;
  this.stopTime=0;
};

Song.prototype={
  play:function()
  {
    this.source=audioCtx.createBufferSource();
    this.source.buffer=this.buffer;
    this.source.connect(audioCtx.destination);
    this.source.start();
  },
  playWithTime:function(time)
  {
    this.source=audioCtx.createBufferSource();
    this.source.buffer=this.buffer;
    this.source.connect(audioCtx.destination);
    this.source.start(audioCtx.currentTime+time);
  },
  getDuration:function(){
    return this.source.buffer.duration;
  }
}