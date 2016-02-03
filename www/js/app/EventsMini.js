define(function(require) {


	function EventsMini(timeline,uiMini){
		this.timeline=timeline;
		this.uiMini=uiMini;
	}

	EventsMini.prototype.initEventsMini = function (){
		this.initPisteClick();
		this.initDragAndDrop();
		this.initModalEvents();
	}

	EventsMini.prototype.initPisteClick = function(){

		var self=this;
		$('.piste').off().mousedown('click', function(event){

		    if($('.piste .song.inDrag').length<1)
		    {
			    var xOnPiste=event.clientX-$(this).offset().left;
			    var songToLoad=$("#buttons-songs .button.active")[0];
			    var idSong=$(songToLoad).attr('data-song-id');

			    var song=self.timeline.songs[idSong];
			    
			    var newSongDiv=self.uiMini.addSongToPiste(songToLoad,$(this),song,xOnPiste);

			    song.play(self.timeline.audioCtx);

			    self.setDragOnSong(newSongDiv);

			}

		});
	}

	EventsMini.prototype.setDragOnSong = function(divSong){

		divSong[0].ontouchstart=divSong[0].onmousedown=function(event){

	  		event.preventDefault();
	  		var clientX;
  			var clientY;

  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}

			$(this).addClass('inDrag');

			$(this).attr('posSongX',$(this).position().left);
			$(this).attr('piste',$(this).parent().attr('id'));



			var top=$(this).parent().position().top;
			$(this).css('top',top);

			$('.piste:first').append($(this));

			


			var posSourisOnSongX=clientX-$('.piste .song.inDrag').offset().left;
			var posSourisOnSongY=clientY-$('.piste .song.inDrag').offset().top;
			$(this).attr('posSourisX',posSourisOnSongX);
			$(this).attr('posSourisY',posSourisOnSongY);
		}

	    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
				divSong[0].onmousedown=null;
		}
	}

	EventsMini.prototype.initDragAndDrop = function () {

  		document.ontouchmove=document.onmousemove=function (event){
  			var clientX;
  			var clientY;

  			if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				clientX=event.touches[0].clientX;
  				clientY=event.touches[0].clientY;
  			}
  			else
  			{
  				clientX=event.clientX;
  				clientY=event.clientY;
  			}

  			var songDragged=$('.piste .song.inDrag');
  			if(songDragged.length>0)
  			{
  				event.preventDefault();
  				var scrollLeft=$( "#timeline" ).scrollLeft();
  				
  				var positionX=clientX-$('#timeline').offset().left+scrollLeft;
		     	var positionY=clientY-$('#timeline').offset().top;

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

				var centerY = songDragged.position().top + songDragged.height() / 2;

				var pisteOverlayed=null;

				$('.piste').each(function(){

					var topPist=$(this).position().top;
					var bottomPiste=$(this).position().top+$(this).height();
						
					if( centerY >= topPist && centerY <= bottomPiste){
				    	pisteOverlayed=$(this);
				  	}

				});

				if(pisteOverlayed!=null)
				{

					var overSong=false;
					songDragged.css('background-color',songDragged.attr('originalBgColor'));
					pisteOverlayed.find('.song').not(songDragged).each(function()
					{
						var leftOtherSong=$(this).position().left;
						var rigthOtherSong=leftOtherSong+$(this).outerWidth();
						
						if(! (rigthOtherSong<=positionX || leftOtherSong>=positionX+songDragged.outerWidth() ) ){
						
							overSong=true;
						}
					});

					if(overSong){
						songDragged.css('background-color',"red");
					}
					songDragged.attr('overOtherSong',overSong);
	      		}

  			}

      	}

  		document.onmouseup=document.ontouchend=function(event){

			if($('.piste .song.inDrag').length>0)
			{

				var songDragged=$('.piste .song.inDrag');
				

				if(songDragged.attr('overOtherSong')=='false')
				{

					var offset = songDragged.offset();
					var height = songDragged.height();
					var centerY = offset.top + height / 2;

					$('.piste').each(function(){
					  if( centerY>$(this).offset().top && centerY < $(this).offset().top+$(this).height()){
					    $(this).append(songDragged);
					  }
					});

					
					songDragged.removeClass('inDrag');
				}
				else{
					var leftOriginal=songDragged.attr('posSongX');
					var pisteOriginal=songDragged.attr('piste');
					
					$("#"+pisteOriginal).append(songDragged);
					songDragged.css('left',leftOriginal+"px");
					
					songDragged.removeClass('inDrag');
				}
				songDragged.css('top',0);
				songDragged.css('background-color',songDragged.attr('originalBgColor'));
			}


		}

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
  				document.onmousedown=null;
  				document.onmouseup=null;
  		}

    }

    EventsMini.prototype.initModalEvents=function(){
    	var self=this;
    	$("#choose-song div .button").click(function(){ 

			var numberId = $(this).find("span").text();
			var typeRight = $(this).attr("type");

			$("#buttons-songs-modal .button[type='"+typeRight+"']").find("span").text(numberId);

			var urlSong = $(this).attr('data-song-url');

			$(this).parent().find('.button').removeClass('active');
			$(this).addClass('active');

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
    }



	return EventsMini;

});