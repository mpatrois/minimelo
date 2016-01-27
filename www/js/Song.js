function Song(){
  this.buffer=null;
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
    source=this.source;
  },
  playWithTime:function(time)
  {
    this.source=audioCtx.createBufferSource();
    this.source.buffer=this.buffer;
    this.source.connect(audioCtx.destination);
    // this.source.loop=true;
    this.source.start(audioCtx.currentTime+time);
  },
  getDuration:function(){
    return this.source.buffer.duration;
  },
  getDebut:function(){
    var left=(this.viewBox.position().left-200)/100;
    return left;
  }
}