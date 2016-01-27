function Timeline(){
      this.songs=[];
      this.tempo=80;
      this.noteTime=(60)/this.tempo/2;
}

Timeline.prototype={
	addSong:function(songElement)
  	{	
  		// alert(this.ctx);
  		// this.ctx=document.getElementById("timeline").getContext("2d");
  		
  		// console.log(this.ctx);
  		//this.ctx=document.getElementById("#timeline").getContext("2d");
  		//canvas.getContext("2d");
  		// alert(songElement.localName);
  		// alert("test");
  		
  	},
  	drawLines:function(){
  // 		this.ctx.beginPath();


		// this.ctx.moveTo(0,0);
		// this.ctx.lineTo(300,150);
		// this.ctx.stroke();
  	},
  	play:function(){
  		console.log("test");
  		var self=this;
  		
  		
  		$('#timeline .piste').each(function(){
  			// console.log(this);
  			var step=0;
  			$(this).find('.box').each(function(){
  			var idSong=$(this).find('.files').attr('data-song-id');
  			
  			
  			if(idSong!=null){
  				timeline.songs[idSong].playWithTime(step*self.noteTime);
  			}
  			step++;
  		});

  		});

  		
  	},
  	loadSong:function(id,urlSong){
  		// console.log(urlSong);
  		var self=this;

  		$.ajax({
		    url: urlSong,
		    xhrFields : {
				responseType : 'arraybuffer'
			},
		}).done(function(arrayBuffer){
			audioCtx.decodeAudioData(arrayBuffer, function(buffer) 
				{
					var song=new Song();
					song.buffer=buffer;
					self.songs[id]=song;
					// song.play();

				},function(e){"Error with decoding audio data" + e.err});
		});
  	}

}