define(function( require ) {

	'use strict';

	var EventsHandler    = require('app/EventsHandler'); 
	var ResourcesHandler = require('app/ResourcesHandler');
	var Timeline         = require('app/Timeline');

	function UiMini(){
	}

	
	UiMini.prototype.hideLoader = function() {
		$( ".loader" ).fadeOut( "slow" );
	}

	UiMini.prototype.initButtonsSongs = function () {

		var types = ResourcesHandler.getActivesTypes();

		for ( var type in types ) {
			var buttonSong = $('<div class="button instrument disabled"></div>');
			buttonSong.attr('type', types[type]);
			buttonSong.append("<span class='numberSong'></span>")

			$('#buttons-songs').append(buttonSong);
		}

		$('#myModal').modal('show');
	}

	UiMini.prototype.initButtonsModal = function () {


		var songsByType = ResourcesHandler.songsDirectories;

		for ( var type in songsByType )
		{
			if(type != "indefini"){
				var line=$("<div type="+type+"></div>");
				$("#choose-song").append(line);
				
				var songs = songsByType[type];

				for ( var song in songs)
				{
					var buttonSong=$('<div class="button instrument"></div>');
					buttonSong.attr('type',type);
					buttonSong.attr('data-song-id', songs[song].id);

					buttonSong.append("<span>" + ++song  + "</span>");

					line.append(buttonSong);
				}
			}
		}
	}

	UiMini.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();

		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiMini.prototype.initUiMini = function (){
		this.initTimelineHeight();
		this.initButtonsSongs();
		this.initPistes();
		this.initButtonsModal();
	}

	UiMini.prototype.initPistes = function () {
		$('.piste').css('width', Timeline.getDurationInPx());
	}

	UiMini.prototype.addSongToPiste = function(songButton,piste,xOnPiste)
	{
		var idSong    = $(songButton).attr('data-song-id');
		var song      = ResourcesHandler.getSong(idSong);
		var widthSong = Timeline.secondsToPxInTimeline(song.getDuration());
		
		var divSong   = $("<div class='song'></div>");

		divSong.attr('type',song.type);
		var colorClass = divSong.css('background-color');
		divSong.attr('data-song-id',idSong);
		divSong.attr('originalBgColor',colorClass);
		divSong.css('left',xOnPiste-widthSong/2);

		divSong.width(widthSong);

		piste.append(divSong);


		return divSong;
	}

	return UiMini;

});
