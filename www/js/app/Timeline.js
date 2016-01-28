define(function(require) {

	'use strict';

	var Song       = require('app/Song');
	var ressources = require('app/ressources');

	function Timeline(){
		this.songs       = [];

		this.songsInPlay = [];

		this.tempo       = 90;
		this.bars        = 20;
		this.stepByBars  = 4;
		this.audioCtx    = new (window.AudioContext || window.webkitAudioContext)();
	}

  	Timeline.prototype.play = function play() {

		var self=this;

		var pistes=document.getElementById('timeline').rows;
		
		var getNbSteps=pistes[0].cells.length;
		
		for (var step = 0; step < getNbSteps; step++) {
			for (var y = 0; y < pistes.length; y++) {
				
				var box=pistes[y].cells[step];

				var instrument=box.querySelector('.instrument');

				if(instrument!=null){
			  			
			  		  var idSong=instrument.getAttribute('data-song-id');
					  var sourcePlaying=this.songs[idSong].playWithTime(step*this.getNoteTime(), this.audioCtx);

					  var idTimeOutActive;
					  var idTimeOutInactive;

					  idTimeOutActive = setTimeout(function(instrument){

							instrument.classList.add('active');
							
							idTimeOutInactive=setTimeout(function(){
						  		
						  		instrument.classList.remove('active');
							
							},100);

					  }, step*this.getNoteTime()*1000,instrument)

					  var index=self.songsInPlay.length;
					  
					  self.songsInPlay.push({index:index,
					  			source:sourcePlaying,
					  		 	timeOutActive:idTimeOutActive,
					  		 	timeOutInactive:idTimeOutInactive});

					  
					  sourcePlaying.index=index;
					  console.log(index,'def');

					  sourcePlaying.onended=function(){

					  	if(delete self.songsInPlay[this.index]){
					  		console.log(self.songsInPlay);
					  		self.songsInPlay.length--;

					  	}

					  	if(self.songsInPlay.length==0){
					  		$('#play_stop').removeClass('stop_btn');
      						$('#play_stop').addClass('play_btn');
					  	};
					  }

				}

			};
		};

  	};

  	Timeline.prototype.stop = function () {

		for (var i = 0; i < this.songsInPlay.length; i++) {
			this.songsInPlay[i].source.stop();
			clearTimeout(this.songsInPlay[i].timeOutActive);
			clearTimeout(this.songsInPlay[i].timeOutInactive);
		};
		this.songsInPlay=[];
  	};

	Timeline.prototype.loadSong = function loadSong(idSong, urlSong,buttonSong) {
		var self=this;

		$.ajax({
			url: urlSong,
			xhrFields : {responseType : 'arraybuffer'},
		}).done(function(arrayBuffer){
		  self.audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
				var song = new Song();
				song.buffer = buffer;
				self.songs[idSong] = song;
				buttonSong.mousedown(function(){
					song.play(self.audioCtx);
					$("#buttons-songs .button").removeClass("active");
                	$(this).addClass("active");
				});
			},function(e){"Error with decoding audio data" + e.err;});	
		});
	};

	Timeline.prototype.getNbSteps = function () {
		return this.bars * this.stepByBars;
	};

	Timeline.prototype.getNoteTime = function () {
		return (60)/this.tempo/4;
	};

  	return Timeline;
});
