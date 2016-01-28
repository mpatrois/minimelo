function Timeline(){
  this.songs=[];
  this.tempo=90;
  this.noteTime=(60)/this.tempo/4;
}

Timeline.prototype={

  play:function(){

    var self=this;

    $('#timeline .piste').each(function(){
     
      var step=0;
      
      $(this).find('.box').each(function(){
        
        var box=$(this);
        var idSong=$(this).find('.instrument').attr('data-song-id');
        if(idSong!=null){
          timeline.songs[idSong].playWithTime(step*self.noteTime);
          setTimeout(function(){
              box.find(".instrument").toggleClass("active");
              setTimeout(function(){
                 box.find(".instrument").removeClass("active");
               },100);

          },step*self.noteTime*1000)
        }
        step++;

      });

    });
  },
  loadSong:function(id,urlSong){
    var self=this;

    $.ajax({
      url: urlSong,
      xhrFields : {responseType : 'arraybuffer'},
    }).
    done(function(arrayBuffer){
      audioCtx.decodeAudioData(arrayBuffer, function(buffer) 
      {
        var song=new Song();
        song.buffer=buffer;
        self.songs[id]=song;
      },function(e){"Error with decoding audio data" + e.err});
    });
  }
}