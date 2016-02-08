define(function(require) {

	var ResourcesHandler = require('app/ResourcesHandler');

	function EventsMini(uiMini){
		this.uiMini=uiMini;
	}

	EventsMini.prototype.initEventsMini = function (){
		this.initPisteClick();
		this.initDragAndDrop();
		this.initModalEvents();
		this.initSongClick();
	}

	EventsMini.prototype.initPisteClick = function(){

		var self=this;
		$('.piste').off().mousedown('click', function(event){

		    if($('.piste .song.inDrag').length<1)
		    {
			    var xOnPiste=event.clientX-$(this).offset().left;
			    var songToLoad=$("#buttons-songs .button.active")[0];
			    // var idSong=$(songToLoad).attr('data-song-id');

			    // var song=self.timeline.songs[idSong];
			    
			    var newSongDiv=self.uiMini.addSongToPiste(songToLoad,$(this),xOnPiste);

			    // song.play(self.timeline.audioCtx);

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

  		document.getElementById('timeline').ontouchmove=function (event){
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

		});

		$(".validate_btn.button").click(function(){

			$("#choose-song div .button.active:not(.disabled)").each(function(){

				var typeSong = $(this).attr('type');
				var buttonToReplace= $("#buttons-songs .button[type='"+typeSong+"']");
				
				var idNewSong=$(this).attr('data-song-id');

				

				buttonToReplace.attr('data-song-id',idNewSong);

				ResourcesHandler.loadSong(idNewSong);
			
			});

		});
    }

    EventsMini.prototype.initSongClick=function (){
    	$( document ).on( "mousedown", ".button[data-song-id]:not(.disabled)", function() {

	        var idSong=$(this).attr('data-song-id');
	        ResourcesHandler.playPreview(idSong);

	        if($(this).parent().attr('id')=="buttons-songs"){
	        	$("#buttons-songs .button").removeClass("active");
	        }
	        else if($(this).parent().parent().attr('id')=="choose-song"){
	        	$(this).parent().find('.button').removeClass("active");
	        }
	        $(this).addClass("active");
    	});
    }

	return EventsMini;

});