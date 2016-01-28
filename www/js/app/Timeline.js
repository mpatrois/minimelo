define(function(require) {

	'use strict';

	var Song       = require('app/Song');
	var ressources = require('app/ressources');

	function Timeline(){
		this.songs       = [];
		this.tempo       = 90;
		this.bars        = 20;
		this.stepByBars  = 4;
		this.audioCtx    = new (window.AudioContext || window.webkitAudioContext)();
	}

  	Timeline.prototype.play = function play() {

		var self=this;

		$('#timeline .piste').each(function(){

		  var step=0;

		  $(this).find('.box').each(function(){

			var box    = $(this);
			var idSong = $(this).find('.instrument').attr('data-song-id');
			if(idSong != null){
			  self.songs[idSong].playWithTime(step*self.getNoteTime(), self.audioCtx);
			  setTimeout(function(){
					box.find(".instrument").toggleClass("active");
					setTimeout(function(){
				  	box.find(".instrument").removeClass("active");
				},100);

			  }, step*self.getNoteTime()*1000)
			}
			step++;

			});

		});
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
