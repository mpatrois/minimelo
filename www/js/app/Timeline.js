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

		this.ratioSecondPixel=100;

		this.debutSong=0;
		this.lineTimeOut=0;

	}

  	Timeline.prototype.play = function () {

		var self=this;

		self.nbSongPlayed=0;
      	self.songsInPlay=[];

      	self.debutSong=self.audioCtx.currentTime;

      	self.lineTimeOut = setInterval(function(){
      		var playingTime=self.audioCtx.currentTime-self.debutSong;
			$("#line").css('left',self.secondsToPxInTimeline(playingTime));
      	},100)

		$('.piste .song').each(function(){
			
			var xSong=$(this).position().left;
			var beginSong=self.pxToSecondsInTimeline(xSong);

			var song=this;

			var idSong=song.getAttribute('data-song-id');
			var step=song.getAttribute('step');

			var sourcePlaying=self.songs[idSong].playWithTime(beginSong, self.audioCtx);
			sourcePlaying.songRef=song;

			var idTimeOutActive;
			var idTimeOutInactive;

			idTimeOutActive = setTimeout(function(song){

				song.classList.add('active');

			}, beginSong*1000,song);

			self.songsInPlay.push({
								    source          : sourcePlaying,
					 				timeOutActive   : idTimeOutActive,
					 				});

			sourcePlaying.onended=function(){

				self.nbSongPlayed++;
				this.songRef.classList.remove('active');

				if(self.nbSongPlayed==self.songsInPlay.length)
				{
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
		};
		this.songsInPlay=[];
		$("#line").css('left',0);
  	};

	Timeline.prototype.loadSong = function (idSong, urlSong) {

		var song = new Song(idSong, urlSong,this.audioCtx);
		this.songs[idSong] = song;

	};

	Timeline.prototype.getNbSteps = function () {
		return this.bars * this.stepByBars;
	};

	Timeline.prototype.getNoteTime = function () {
		return (60)/this.tempo/4;
	};

	Timeline.prototype.secondsToPxInTimeline =function (second){
		return second*this.ratioSecondPixel;
	}

	Timeline.prototype.pxToSecondsInTimeline =function (px){
		return px/this.ratioSecondPixel;
	}

	Timeline.prototype.zoom=function(){
		var lastRatio=this.ratioSecondPixel;
		this.ratioSecondPixel+=10;
		this.redrawSongs(lastRatio);
	}

	Timeline.prototype.unzoom=function(){
		var lastRatio=this.ratioSecondPixel;
		this.ratioSecondPixel-=10;
		this.redrawSongs(lastRatio);	
	}

	Timeline.prototype.redrawSongs=function(lastRatio){
		var self=this;
		$('.piste .song').each(function()
		{	
			var idSong=$(this).attr('data-song-id');
			var song=self.songs[idSong];
			$(this).css('width',self.ratioSecondPixel*song.getDuration());
			$(this).css('left',self.ratioSecondPixel*$(this).position().left/lastRatio);
		});
	}

  	return Timeline;
});
