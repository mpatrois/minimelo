define(function( require ) {

  'use strict';

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

      $('#buttons-songs').append(buttonSong);

      this.timeline.loadSong(idSong, urlSong, buttonSong);
      idSong++;
    } 

  };

  UiMini.prototype.initButtonsModal = function () {

    var self=this;

    $("#buttons-songs .button").each(function(){
      var buttonsClone=$(this).clone();
      $("#buttons-songs-modal").append(buttonsClone);
    });

    $("#buttons-songs-modal .button").click(function(){
      $("#buttons-songs-modal .button.active").removeClass('active');
      $(this).addClass('active');
      var idSong=$(this).attr("data-song-id");
      console.log(self);
      self.timeline.songs[idSong].play(self.timeline.audioCtx);

    })

  };

  UiMini.prototype.initUiMini = function (){
  	this.initButtonsSongs();
    this.initButtonsModal();
    this.initDeckButtons();
    this.initPistes();
    this.initDragAndDrop();
  }

  UiMini.prototype.initDeckButtons = function () {
	
	var self=this;

	$(".round_btn.trash_btn").click(function(){
            $('.box').empty();
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

    $(".plus_instru").click(function() {
        $(".overlay").toggleClass('active');
    });

  };

  UiMini.prototype.initDragAndDrop = function () {
      
    document.ontouchmove = function(e){
      if(e.touches.length == 1){ // Only deal with one finger

        if($('.piste .song.inDrag').length>0){
          
          event.preventDefault();
          var scrollLeft=$( "#timeline" ).scrollLeft();

          var positionX=event.touches[0].clientX-$('#timeline').offset().left+scrollLeft;
          var positionY=event.touches[0].clientY-$('#timeline').offset().top;
          
          positionX-=$('.piste .song.inDrag').attr('posSourisX');
          positionY-=$('.piste .song.inDrag').attr('posSourisY');

          if(positionX<0){
            positionX=0;
          }
          if(positionX>$('.piste').width()-$('.piste .song.inDrag').width()){
            positionX=$('.piste').width()-$('.piste .song.inDrag').width();
          }

          if(positionY<0){
            positionY=0;
          }
          
          $('.piste .song.inDrag').css('left',positionX);
          $('.piste .song.inDrag').css('top',positionY);
      
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
          
          // console.log(event.clientX);
          // console.log(event.clientY);

          var posSourisOnSongX=event.clientX-$('.piste .song.inDrag').offset().left;
          var posSourisOnSongY=event.clientY-$('.piste .song.inDrag').offset().top;
          $(this).attr('posSourisX',posSourisOnSongX);
          $(this).attr('posSourisY',posSourisOnSongY);
          
        });


        $(this).append(divSong);
        
        self.timeline.songs[idSong].play(self.timeline.audioCtx);

      
    });

  };

  return UiMini;

});
