define(function(require) {

	'use strict';

	var Song       = require('app/Song');
	var ressources = require('app/ressources');

	function Timeline(){
		this.songs       = [];
		this.tempo       = 90;
		this.bars        = 20;
		this.stepByBars  = 4;
	}

  	Timeline.prototype.play = function () {

		var self=this;

		$('#timeline .piste').each(function(){

		  var step=0;

		  $(this).find('.box').each(function(){

			var box    = $(this);
			var idSong = $(this).find('.instrument').attr('data-song-id');

			if(idSong != null){
			  self.songs[idSong].playWithTime(step*self.getNoteTime());
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

	Timeline.prototype.loadSong = function (idSong, urlSong) {

		var song = new Song(idSong, urlSong);
		this.songs[idSong] = song;

	};

	Timeline.prototype.getNbSteps = function () {
		return this.bars * this.stepByBars;
	};

	Timeline.prototype.getNoteTime = function () {
		return (60)/this.tempo/4;
	};

  	return Timeline;
});
