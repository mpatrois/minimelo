define(function( require ) {

	'use strict';

	require('app/Song');
    var EventHandler  = require('app/EventHandler'); 

	function UiMini(timeline){
		this.timeline=timeline;
	}


  	UiMini.prototype.initButtonsSongs = function () {

		var idSong = 0;

	    for(var classe in ressources)
	    {

	      var urlSong = ressources[classe].songs[0].url;
	      var colorClass = ressources[classe].color;


	      var buttonSong=$('<div class="button instrument"></div>');
	      buttonSong.attr('type',classe);
	      buttonSong.attr('data-song-id',idSong);
	      buttonSong.css('background-color',colorClass);
	      buttonSong.attr('data-song-url', urlSong);
	      buttonSong.append("<span></span>");

	      $('#buttons-songs').append(buttonSong);

	      this.timeline.loadSong(idSong, urlSong, buttonSong);
	      idSong++;
	    } 	

	};

	UiMini.prototype.initButtonsModal = function () {

        var eventHandler = new EventHandler();

		var self=this;

		$("#buttons-songs .button").each(function(){
			

			var buttonsClone=$(this).clone();
			console.log(buttonsClone);

			$("#buttons-songs-modal").append(buttonsClone);

				var type=$(this).attr('type');
				var tabType=ressources[type];

				var typeLine = buttonsClone.attr("type");
				var line=$("<div class='col-xs-12' type="+typeLine+"></div>");
				var instruLine = $("#choose-song").append(line);

				var numberSong = 1;

				for (var i = 0; i < tabType.songs.length; i++) {
					var cloneWithUrl=buttonsClone.clone();
					cloneWithUrl.attr('data-song-url',tabType.songs[i].url);
					cloneWithUrl.removeAttr('data-song-id'); 

					var typeClone = cloneWithUrl.attr("type");

					if(typeClone == typeLine)
						cloneWithUrl.append("<span>"+numberSong+"</span>");
						line.append(cloneWithUrl);
						numberSong++;
						
				};

		});


		$("#choose-song div .button").click(function(){ 

				var numberId = $(this).find("span").text();
				console.log(numberId);

				var typeRight = $(this).attr("type");

				$("#buttons-songs-modal .button[type='"+typeRight+"']").find("span").text(numberId);

			var urlSong = $(this).attr('data-song-url');

			$.ajax({
	            url: urlSong,
	            xhrFields : {responseType : 'arraybuffer'}
	        }).done(function(arrayBuffer){

	            self.timeline.audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
	            var source = self.timeline.audioCtx.createBufferSource();
					source.buffer = buffer;
					source.connect(self.timeline.audioCtx.destination);
					source.start();

	          }, function(e) {"Error with decoding audio data" + e.err;} );  

	        });

		});

        eventHandler.Active($("#buttons-songs-modal .button"));
			
		$("#choose-song div .button").click(function(){

			$(this).parent().find('.button').removeClass('active');
			$(this).addClass('active');
			// $(this).parent()filter("[type='"+type+"']").addClass("active");
			// $(this).removeClass("active");	
		});

		$(".validate_btn.button").click(function(){


			$("#choose-song div .button.active").each(function(){

			var typeModal = $(this).attr('type');
			var urlModal = $(this).attr('data-song-url');

			var buttonToReplace= $("#buttons-songs .button[type='"+typeModal+"']");
			console.log(buttonToReplace);

			var oldUrl = buttonToReplace.attr("data-song-url");

			if (urlModal != oldUrl){

				$.ajax({
		        	url: urlModal,
		            xhrFields : {responseType : 'arraybuffer'}
		        	}).done(function(arrayBuffer){

		            self.timeline.audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
		           		var idSong = buttonToReplace.attr("data-song-id");
		            	self.timeline.songs[idSong].buffer=buffer;

		          	}, function(e) {"Error with decoding audio data" + e.err;} );  
		        });

		        buttonToReplace.attr("data-song-url", urlModal);

			 }

			});

		});

	};

	UiMini.prototype.initUiMini = function (){
		this.initButtonsSongs();
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
		    var song=self.timeline.songs[idSong];

		    divSong.attr('type',$(songToLoad).attr('type'));
		    divSong.attr('data-song-id',idSong);
		    divSong.attr('step',$(this).attr('step'));

		    var widthSong=self.timeline.secondsToPxInTimeline(song.getDuration());
		    divSong.width(widthSong);
		    divSong.css('background-color',colorClass);
		    divSong.css('left',xOnPiste-widthSong/2);

		    
		    divSong.mousedown(function(event){
		      // alert('salut');
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
		    
		    self.timeline.songs[idSong].play(self.timeline.audioCtx);

	  
		});
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
	        else{
	          $(this).removeClass('stop_btn');
	          $(this).addClass('play_btn');
	          self.timeline.stop();
	        }
	        
	    });

	};

	return UiMini;

});
