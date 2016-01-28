define(function( require ) {

    'use strict';

    function UiMini(timeline){
        this.timeline=timeline;
    }

    UiMini.prototype.initButtonsSongs = function () {

        var idSong = 0;

        for(var classe in ressources)
        {

            var tabInstru = ressources[classe][0];

            var buttonSong=$('<div class="button instrument"></div>');
            buttonSong.attr('type',classe);
            buttonSong.attr('data-song-id',idSong);

            $('#buttons-songs').append(buttonSong);

            this.timeline.loadSong(idSong, tabInstru.url, buttonSong);
            idSong++;
        }

    };

    UiMini.prototype.initButtonsModal = function () {

        var self=this;

        $("#buttons-songs .button").each(function(){
          var buttonsClone=$(this).clone();

          $("#buttons-songs-modal").append(buttonsClone);

          buttonsClone.click(function(event){
            // console.log($(this).attr('type'));
            var type=$(this).attr('type');
            var tabType=ressources[type];
            $("#choose-song").empty();
            for (var i = 0; i < tabType.length; i++) {
              console.log(tabType[i]);
              var cloneWithUrl=buttonsClone.clone();
              cloneWithUrl.attr('data-song-url',tabType[i].url);
              $("#choose-song").append(cloneWithUrl);
          };


        $("#choose-song .button").click(function(){
            $("#choose-song .button.active").removeClass('active');
            $(this).addClass('active');

            var idSong=$(this).attr("data-song-id");
            self.timeline.songs[0].play(self.timeline.audioCtx);

        });

  });

  });

    $("#buttons-songs-modal .button").click(function(){
      $("#buttons-songs-modal .button.active").removeClass('active');
      $(this).addClass('active');
      var idSong=$(this).attr("data-song-id");
      self.timeline.songs[idSong].play(self.timeline.audioCtx);

  });

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

    for (var i = 0; i < sefl.timeline.getNbSteps(); i++) {
        $(this).append('<div class="box"></div>');
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
