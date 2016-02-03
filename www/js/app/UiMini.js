define(function( require ) {

	'use strict';

	require('app/Song');

	function UiMini(timeline){
		this.timeline=timeline;
	}

  	UiMini.prototype.initButtonsSongs = function () {

		var idSong = 0;

	    for(var classe in ressources)
	    {

	      var urlSong = ressources[classe].songs[0].url;
	      var buttonSong=$('<div class="button instrument"></div>');
	      buttonSong.attr('type',classe);
	      buttonSong.attr('data-song-id',idSong);
	      buttonSong.attr('data-song-url', urlSong);
	      buttonSong.append("<span></span>");

	      $('#buttons-songs').append(buttonSong);

	      this.timeline.loadSong(idSong, urlSong, buttonSong);
	      idSong++;
	    } 	

	};

	UiMini.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();

		console.log(heightHeader);
		console.log(heightFooter);
		console.log(heightApp);

		
		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiMini.prototype.initButtonsModal = function () {

		var self=this;

		$("#buttons-songs .button").each(function(){
			
			var button=$(this);

			var type=$(this).attr('type');
			var songsOfType=ressources[type];

			var typeLine = button.attr("type");
			var line=$("<div type="+typeLine+"></div>");
			var instruLine = $("#choose-song").append(line);

			var numberSong = 1;

			for (var i = 0; i < songsOfType.songs.length; i++) {
				var song=songsOfType.songs[i];
				var cloneWithUrl=button.clone();
				cloneWithUrl.attr('data-song-url',song.url);
				cloneWithUrl.removeAttr('data-song-id');
				if(song.url==button.attr('data-song-url')){
					cloneWithUrl.addClass('active');
				}

				var typeClone = cloneWithUrl.attr("type");

				if(typeClone == typeLine)
					cloneWithUrl.append("<span>"+numberSong+"</span>");
					line.append(cloneWithUrl);
					numberSong++;
			};

		});

	};

	UiMini.prototype.initUiMini = function (){
		this.initTimelineHeight();
		this.initButtonsSongs();
		this.initButtonsModal();
		this.initDeckButtons();
		this.initPistes();
	}

  	

	UiMini.prototype.initPistes = function () {
		$('.piste').css('width',this.timeline.getDurationInPx());
	};

	UiMini.prototype.initDeckButtons = function () {
		
		var self=this;

		$(".round_btn.trash_btn").click(function(){
	            $('.piste').empty();
	    });

	    $('#play_stop').click(function() {
	        if($(this).hasClass('play_btn'))
	        {
	          $(this).removeClass('play_btn');
	          $(this).addClass('stop_btn');
	          self.timeline.play();
	        }
	        else
	        {
	          $(this).removeClass('stop_btn');
	          $(this).addClass('play_btn');
	          self.timeline.stop();
	        }
	        
	    });

	    $('#zoom').click(function(){
	    	self.timeline.zoom();
	    });

	    $('#unzoom').click(function(){
	    	self.timeline.unzoom();
	    });

	};

	UiMini.prototype.addSongToPiste = function(songButton,piste,song,xOnPiste)
	{
		var songButton=$("#buttons-songs .button.active")[0];
	    var colorClass=$(songButton).css('background-color');
	    var idSong=$(songButton).attr('data-song-id');
	    var typeSong=$(songButton).attr('type');
	    var widthSong=this.timeline.secondsToPxInTimeline(song.getDuration());
	    
	    var divSong=$("<div class='song'></div>");

	    divSong.attr('type',typeSong);
	    console.log(divSong.css('background-color'));
	    divSong.attr('data-song-id',idSong);
	    divSong.attr('originalBgColor',colorClass);
	    divSong.css('left',xOnPiste-widthSong/2);

	    divSong.width(widthSong);

	    piste.append(divSong);

	    return divSong;
	}

	return UiMini;

});
