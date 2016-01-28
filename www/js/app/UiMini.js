define(function( require ) {

  'use strict';

  // $.fn.save = function() {
  //   	alert('a garder !');
  // };

  function UiMini(timeline){
    this.timeline=timeline;
  }

  UiMini.prototype.initButtonsSongs = function () {
	
	var sefl=this;

	for (var idSong = 0; idSong < ressources.length; idSong++) {

        var buttonSong=$('<div class="button instrument"></div>');
        // var buttonSong=$('<td class="button instrument"></td>');
        buttonSong.attr('type',ressources[idSong].type);
        buttonSong.attr('data-song-id',idSong);
        
        $('#buttons-songs').append(buttonSong);

        this.timeline.loadSong(idSong,ressources[idSong].url,buttonSong);

    };

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

  UiMini.prototype.initPistes = function () {
	
	var sefl=this;

	 $('.piste').each(function(){

        for (var i = 0; i < sefl.timeline.getNbSteps(); i++) {
            $(this).append('<td class="box"></td>');
        };

        $(this).css('width',$('.box').outerWidth()*sefl.timeline.getNbSteps());
    });

  	$('.box').off().on('click', function(e){
  	    e.preventDefault();
  	    var button=$("#buttons-songs .button.active")[0];

  	    if($(this).find('.instrument')[0] == null && button != null) {
  	        var clone=$("<div class='instrument'></div>");
  	        clone.attr('type',$(button).attr('type'));
  	        clone.attr('data-song-id',$(button).attr('data-song-id'));
  	        $(this).append(clone);
  	    } 
  	    else 
  	    {
  	        $(this).empty();
  	    }
  	});

  };

  return UiMini;

});
