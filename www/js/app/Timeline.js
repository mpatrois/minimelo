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

		this.nbSongPlayed=0;
		this.duration=10;

		this.debutSong=0;
		this.lineTimeOut=0;
	}

  	Timeline.prototype.play = function () {

		var self=this;

		self.nbSongPlayed=0;
      	self.songsInPlay=[];

      	self.debutSong=self.audioCtx.currentTime;
      	// self.uploadLine();

      	self.lineTimeOut = setInterval(function(){
      		var playingTime=self.audioCtx.currentTime-self.debutSong;
			$("#line").css('left',self.secondsToPxInTimeline(playingTime));
      	},100)




		
		$('.piste .song').each(function(){
			
			var xSong=$(this).position().left;
			var beginSong=self.pxToSecondsInTimeline(xSong);

			var instrument=this;

			var idSong=instrument.getAttribute('data-song-id');
			var step=instrument.getAttribute('step');

			var sourcePlaying=self.songs[idSong].playWithTime(beginSong, self.audioCtx);

			var idTimeOutActive;
			var idTimeOutInactive;

			idTimeOutActive = setTimeout(function(instrument){

				instrument.classList.add('active');

				idTimeOutInactive = setTimeout(function(){
						
						instrument.classList.remove('active');

				},100);

			}, beginSong*1000,instrument);

			var index=self.songsInPlay.length;

			self.songsInPlay.push({ index           : index,
								    source          : sourcePlaying,
					 				timeOutActive   : idTimeOutActive,
					 				timeOutInactive : idTimeOutInactive});

			sourcePlaying.onended=function(){

				self.nbSongPlayed++;

				if(self.nbSongPlayed==self.songsInPlay.length){
					$('#play_stop').removeClass('stop_btn');
					$('#play_stop').addClass('play_btn');
					clearInterval(self.lineTimeOut);
					$("#line").css('left',0);
				}
			}

		})

  	};

  	Timeline.prototype.stop = function () {

  		clearInterval(this.lineTimeOut);
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

	Timeline.prototype.secondsToPxInTimeline =function (second){
		return second*$('#timeline').width()/this.duration;
	}

	Timeline.prototype.pxToSecondsInTimeline =function (px){
		return px*this.duration/$('#timeline').width();
	}

  	return Timeline;
});
