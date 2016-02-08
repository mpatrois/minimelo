define(function( require ) {

	'use strict';

	var ressources 		 = require('app/ressources');
	var Timeline         = require('app/Timeline');
	var EventsHandler    = require('app/EventsHandler'); 
	var ResourcesHandler = require('app/ResourcesHandler');

	function UiMini(){
		this.timeline = new Timeline();
	}

  	UiMini.prototype.initButtonsSongs = function () {
  		
	   	var types=ResourcesHandler.getTypes();

	   	for (var i = 1; i < 9; i++) {
	   		var type="type-"+i;
	        var buttonSong=$('<div class="button instrument"></div>');
	        buttonSong.attr('type',type);

	        $('#buttons-songs').append(buttonSong);
	   	};
	};

UiMini.prototype.initButtonsModal = function () {

    var self=this;

    var songsByType = ResourcesHandler.songsDirectories;

	for ( var type in songsByType )
	{
		var line=$("<div type="+type+"></div>");
		$("#choose-song").append(line);
		
		var songs=songsByType[type];
		for (var i = 0; i < songs.length; i++){

			var song=songs[i];

			var buttonSong=$('<div class="button instrument"></div>');
			buttonSong.attr('type',type);
			buttonSong.attr('data-song-id', song.id);

			buttonSong.append("<span>" +i+ "</span>");

			line.append(buttonSong);
		}
	}

    // $("#buttons-songs .button").each(function(){
      
    //   var button=$(this);

    //   var type=$(this).attr('type');
    //   var songsOfType=ressources[type];


    //   var typeLine = button.attr("type");
    //   var line=$("<div type="+typeLine+"></div>");
    //   var instruLine = $("#choose-song").append(line);

    //   var numberSong = 1;

    //   for (var i = 0; i < songsOfType.length; i++) {
    //     var urlSong=songsOfType[i];
    //     var idSong=ResourcesHandler.getIdFirstSongUrl(urlSong);
    //     var newButtonModal=$("<div class='button'>");
    //     if(idSong!=-1){
    //     // cloneWithUrl.attr('data-song-url',song.url);
    //     newButtonModal.attr('data-song-id',idSong);
    //     newButtonModal.attr('type',type);
        
    //     if($("#buttons-songs .button[data-song-id="+idSong+"]").length>0){
    //       newButtonModal.addClass('active');
    //     }
    //       newButtonModal.append("<span>"+numberSong+"</span>");
    //       line.append(newButtonModal);
    //       numberSong++;
    //     }
    //   };

    // });

  };

	UiMini.prototype.initTimelineHeight = function() {
		var heightHeader = $("h1").outerHeight();
		var heightFooter = $("#deck-buttons").outerHeight();
		var heightApp = $(".app").outerHeight();
		
		$("#timeline").css("height", heightApp - (heightHeader + heightFooter));
	}

	UiMini.prototype.initUiMini = function (){
		this.initTimelineHeight();
		this.initButtonsSongs();
		// this.initButtonsModal();
		this.initDeckButtons();
		this.initPistes();
		this.initRecorder();
	}

	UiMini.prototype.initPistes = function () {
    $('.piste').css('width',this.timeline.getDurationInPx());
  };



	UiMini.prototype.initSongClick = function () {

    // $( document ).on( "click", ".button[data-song-id]", function() {
    //   console.log($(this));
    // });

		// $("*[data-song-id]").mousedown(function(){
  //       ResourcesHandler.getSong($(this).attr('data-song-id')).play();
  //       $("#buttons-songs .button").removeClass("active");
  //       $(this).addClass("active");
  //   });
	}

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

	UiMini.prototype.initRecorder=function(){
		// console.log(recordScreen.clientWidth);
		$('#modal-record-sound').modal('show');
		
		$('#canvasRecord').attr('width',recordScreen.clientWidth);
		$('#canvasRecord').attr('height',recordScreen.clientHeight);


		$('#modal-record-sound').modal('hide');
	}

	UiMini.prototype.addSongToPiste = function(songButton,piste,xOnPiste)
	{
	    var idSong=$(songButton).attr('data-song-id');
      var song=ResourcesHandler.getSong(idSong);
	    var widthSong=this.timeline.secondsToPxInTimeline(song.getDuration());
	    
	    var divSong=$("<div class='song'></div>");

	    divSong.attr('type',song.type);
	    var colorClass=divSong.css('background-color');
	    divSong.attr('data-song-id',idSong);
	    divSong.attr('originalBgColor',colorClass);
	    divSong.css('left',xOnPiste-widthSong/2);

	    divSong.width(widthSong);

	    piste.append(divSong);

	    return divSong;
	}

	return UiMini;

});
