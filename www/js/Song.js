function Song(){
  this.buffer=null;
  this.viewBox=null;
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
  loadSongFromUrl:function(url){
        request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.responseType = 'arraybuffer';
        var self=this;

        request.onload = function() {
          
          audioCtx.decodeAudioData(request.response, function(buffer) 
          {
            self.buffer=buffer;
            self.play();
            self.viewBox.css('width',($('#timeline').width()-20)*self.getDuration()/10);
            
             self.viewBox.draggable();

          },function(e){"Error with decoding audio data" + e.err});
        }
        request.send();
  },
  setBox:function(box){
    this.box=box;
  },
  getDuration:function(){
    return this.source.buffer.duration;
  },
  getDebut:function(){
    var left=(this.viewBox.position().left-200)/100;
    return left;
  }
}