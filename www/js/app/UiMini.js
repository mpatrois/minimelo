define(function( require ) {

	'use strict';

	var ressources 		 = require('app/ressources');
	var Timeline         = require('app/Timeline');
	var EventsHandler    = require('app/EventsHandler'); 
	var ResourcesHandler = require('app/ResourcesHandler');

	function UiMini(){
		this.timeline = new Timeline();
	}

	// should be removed any time soon
	UiMini.prototype.initButtonsSongs = function () {
		
		var songs  = ResourcesHandler.getSongs();  

		for(var type in ressources)
		{

			var colorClass = ressources[type].color;
			var buttonSong =$('<div class="button instrument"></div>');

			buttonSong.attr('type',type);
			// buttonSong.css('background-color',colorClass);

			
			var found = false;
			var id 	  = 0;

			while ( found == false )
			{
				if ( songs[id].type == type)
				{
					found = true;
					songs[id].load();
					buttonSong.attr('data-song-id', id);
				} 
				id++;
				
			}

			$('#buttons-songs').append(buttonSong);
		} 	

	};

	UiMini.prototype.initButtonsModal = function () {

		var self=this;


		// clone les boutons à gauche dans le modal
		$("#buttons-songs .button").each(function(){
			
			var buttonsClone = $(this).clone();
			$("#buttons-songs-modal").append(buttonsClone);

			var typeLine   = buttonsClone.attr("type");
			var line       = $("<div class='col-xs-12' type="+typeLine+"></div>");
			var instruLine = $("#choose-song").append(line);

		});

		for( var songs in ResourcesHandler.getSongs() )
		{
			var song = ResourcesHandler.getSongs()[songs];

			var buttonSong=$('<div class="button instrument"></div>');
			buttonSong.attr('type', song.type);
			buttonSong.attr('data-song-id', song.id);

			if( song.loaded )
				buttonSong.addClass('active');

			$("#choose-song").find('.col-xs-12[type=' + song.type + ']').append(buttonSong);

		}

		

		$("#choose-song div .button").click(function(){

			var idSong = $(this).attr('data-song-id');
			ResourcesHandler.getSong(idSong).playOnce();
			$(this).parent().find('.button').removeClass('active');
			$(this).addClass('active');

		});

		$('#choose-song div .button').unbind();

		
		EventsHandler.active($("#buttons-songs-modal .button"));

		$(".validate_btn.button").click(function(){


			$("#choose-song div .button.active").each(function(){

				var typeModal = $(this).attr('type');
				var idModal = $(this).attr('data-song-id');

				var buttonToReplace= $("#buttons-songs .button[type='"+typeModal+"']");
				var oldId = buttonToReplace.attr("data-song-id");

				if (idModal != oldId){

					ResourcesHandler.getSong(idModal);
					buttonToReplace.attr("data-song-id", idModal);

				}

			});

		});

	}

	UiMini.prototype.initUiMini = function (){
		this.initButtonsSongs();
		this.initSongClick();
		this.initButtonsModal();
		this.initDeckButtons();
		this.initPistes();
		this.initDragAndDrop();
	}

	UiMini.prototype.initDragAndDrop = function () {

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

			document.ontouchmove = function(e){
			  if(e.touches.length == 1){ // Only deal with one finger

			  	if($('.piste .song.inDrag').length>0){

			  		event.preventDefault();
			  		var scrollLeft=$( "#timeline" ).scrollLeft();
			  		var songDragged=$('.piste .song.inDrag');

			  		var positionX=event.touches[0].clientX-$('#timeline').offset().left+scrollLeft;
			  		var positionY=event.touches[0].clientY-$('#timeline').offset().top;

			  		positionX-=songDragged.attr('posSourisX');
			  		positionY-=songDragged.attr('posSourisY');

			  		if(positionX<0){
			  			positionX=0;
			  		}
			  		if(positionX>$('.piste').width()-songDragged.width()){
			  			positionX=$('.piste').width()-songDragged.width();
			  		}

			  		if(positionY<0){
			  			positionY=0;
			  		}

			  		var heightTimeline=$('.piste').outerHeight()*$('.piste').length;

			  		if(positionY + songDragged.height() > heightTimeline ){
			  			positionY=heightTimeline - songDragged.height();
			  		}

			  		songDragged.css('left',positionX);
			  		songDragged.css('top',positionY);

			  	}

			  }
			}

			document.ontouchend=function(event){

				if($('.piste .song.inDrag').length>0)
				{

					var song=$('.piste .song.inDrag');
					var offset = song.offset();
					var height = song.height();
					var centerY = offset.top + height / 2;

					$('.piste').each(function(){
						if( centerY>$(this).offset().top && centerY < $(this).offset().top+$(this).height()){
							$(this).append(song);
						}
					});

					song.css('top',0);
					song.removeClass('inDrag');
				}


			}

		}
		else{

			document.onmousemove = function(event){

				if($('.piste .song.inDrag').length>0 ){

					event.preventDefault();
					var songDragged=$('.piste .song.inDrag');

					var scrollLeft=$( "#timeline" ).scrollLeft();

					var positionX=event.clientX-$('#timeline').offset().left+scrollLeft;
					var positionY=event.clientY-$('#timeline').offset().top;

					positionX-=songDragged.attr('posSourisX');
					positionY-=songDragged.attr('posSourisY');

					if(positionX<0){
						positionX=0;
					}
					if(positionX>$('.piste').width()-songDragged.width()){
						positionX=$('.piste').width()-songDragged.width();
					}

					if(positionY<0){
						positionY=0;
					}

					var heightTimeline=$('.piste').outerHeight()*$('.piste').length;

					if(positionY + songDragged.height() > heightTimeline ){
						positionY=heightTimeline - songDragged.height();
					}

					songDragged.css('left',positionX);
					songDragged.css('top',positionY);

				}
			}

			document.onmouseup=function(event){

				if($('.piste .song.inDrag').length>0)
				{

					var song=$('.piste .song.inDrag');
					var offset = song.offset();
					var height = song.height();
					var centerY = offset.top + height / 2;

					$('.piste').each(function(){
						if( centerY>$(this).offset().top && centerY < $(this).offset().top+$(this).height()){
							$(this).append(song);
						}
					});

					song.css('top',0);
					song.removeClass('inDrag');
				}


			}

		}

	}

	UiMini.prototype.initPistes = function () {

		var self=this;
		$('.piste').css('width',3000);

		$('.piste').off().mousedown('click', function(event){
			event.preventDefault();

			var xOnPiste=event.clientX-$(this).offset().left;

			var songToLoad=$("#buttons-songs .button.active")[0];

			var colorClass=$(songToLoad).css('background-color');

			var divSong=$("<div class='song'></div>");
			var idSong=$(songToLoad).attr('data-song-id');
			var song=ResourcesHandler.getSong(idSong); // ici

			divSong.attr('type',$(songToLoad).attr('type'));
			divSong.attr('data-song-id',idSong);
			divSong.attr('step',$(this).attr('step'));

			var widthSong=self.timeline.secondsToPxInTimeline(song.getDuration());
			divSong.width(widthSong);
			divSong.css('background-color',colorClass);
			divSong.css('left',xOnPiste-widthSong/2);


			divSong.mousedown(function(event){
				event.stopPropagation();
				event.preventDefault();
				$(this).addClass('inDrag');

				var top=$(this).parent().position().top;
				$(this).css('top',top);
				$('.piste:first-of-type').append($(this));

				var posSourisOnSongX=event.clientX-$('.piste .song.inDrag').offset().left;
				var posSourisOnSongY=event.clientY-$('.piste .song.inDrag').offset().top;
				$(this).attr('posSourisX',posSourisOnSongX);
				$(this).attr('posSourisY',posSourisOnSongY);

			});


			$(this).append(divSong);

			song.play(self.timeline.audioCtx);


		});
	}

	UiMini.prototype.initSongClick = function () {
		$("*[data-song-id]").mousedown(function(){
            ResourcesHandler.getSong($(this).attr('data-song-id')).play();
            $("#buttons-songs .button").removeClass("active");
            $(this).addClass("active");
        });
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

	}

	return UiMini;

});
