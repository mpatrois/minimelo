define(function(require) {

  'use strict';

  var Song       = require('app/Song');
  var ressources = require('app/ressources');

  function Timeline(){
    this.songs=[];
    this.tempo=90;
    this.noteTime=(60)/this.tempo/2;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  Timeline.prototype={

    play:function(){

      var self=this;

      $('#timeline .piste').each(function(){

        var step=0;
        
        $(this).find('.box').each(function(){

          var idSong=$(this).find('.instrument').attr('data-song-id');
          if(idSong!=null){
            self.songs[idSong].playWithTime(step*self.noteTime, self.audioCtx);
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
        self.audioCtx.decodeAudioData(arrayBuffer, function(buffer) 
        {
          var song = new Song();
          song.buffer = buffer;
          self.songs[id] = song;
        },function(e){"Error with decoding audio data" + e.err});
      });
    }
  }

  return Timeline;
});
