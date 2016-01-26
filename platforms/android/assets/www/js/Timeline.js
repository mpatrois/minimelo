function Timeline(){
      this.songs=[];
      this.ctx=this.ctx=document.getElementById("timeline").getContext("2d");
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
  		this.ctx.beginPath();


		this.ctx.moveTo(0,0);
		this.ctx.lineTo(300,150);
		this.ctx.stroke();
  	}
}