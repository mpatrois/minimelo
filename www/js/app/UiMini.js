define(function( require ) {

  'use strict';

  $.fn.hello = function() {
    	alert('hello !');
  };

  function UiMini(timeline){
    this.timeline=timeline;
    this.nbBox=120;
  }

  UiMini.prototype.initButtonsSongs = function () {
	
	var sefl=this;

	for (var idSong = 0; idSong < ressources.length; idSong++) {

        var buttonSong=$('<div class="button instrument"></div>');
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

    $('#play').click(function() {
        self.timeline.play();
    });

    $(".plus_instru").click(function() {
        $(".overlay").toggleClass('active');
    });

  };

  UiMini.prototype.initPistes = function () {
	
	var sefl=this;

	 $('.piste').each(function(){

        for (var i = 0; i < sefl.nbBox; i++) {
            $(this).append('<div class="box"></div>');
        };

        $(this).css('width',$('.box').outerWidth()*sefl.nbBox);
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
