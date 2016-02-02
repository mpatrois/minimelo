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

			var tabInstru = ressources[classe][0];

			var buttonSong=$('<div class="button instrument"></div>');
			buttonSong.attr('type',classe);
			buttonSong.attr('data-song-id',idSong);
			buttonSong.attr('data-song-url', tabInstru.url);
			buttonSong.append("<span></span>");

			$('#buttons-songs').append(buttonSong);

			this.timeline.loadSong(idSong, tabInstru.url, buttonSong);
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
			// $(".plus_btn").click(function(){
				// console.log($(this).attr('type'));
				var typeLine = buttonsClone.attr("type");
				var line=$("<div class='col-xs-12' type="+typeLine+"></div>");
				var instruLine = $("#choose-song").append(line);
				//console.log(instruLine);

				var numberSong = 1;
				
				for (var i = 0; i < tabType.length; i++) {
					var cloneWithUrl=buttonsClone.clone();
					cloneWithUrl.attr('data-song-url',tabType[i].url);
					cloneWithUrl.removeAttr('data-song-id'); 
					//$("#choose-song").append(cloneWithUrl);
					var typeClone = cloneWithUrl.attr("type");

					if(typeClone == typeLine)
						cloneWithUrl.append("<span>"+numberSong+"</span>");
						line.append(cloneWithUrl);
						numberSong++;
				};


			});
			// });
			
		


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

			            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
			            var source = audioCtx.createBufferSource();
        					source.buffer = buffer;
        					source.connect(audioCtx.destination);
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


					// $("#buttons-songs .button").each(function(){
					// 	urlOldInstru = $("#buttons-songs .button").attr("data-song-url");
					// });

					if (urlModal != oldUrl){

						$.ajax({
				        	url: urlModal,
				            xhrFields : {responseType : 'arraybuffer'}
				        	}).done(function(arrayBuffer){

				            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
				           		var idSong = buttonToReplace.attr("data-song-id");
				            	self.timeline.songs[idSong].buffer=buffer;

				          	}, function(e) {"Error with decoding audio data" + e.err;} );  
				        });

				        buttonToReplace.attr("data-song-url", urlModal);

					 }

					 // idSong = buttonToReplace.attr("data-song-id");
					 // self.timeline.loadSong(idSong, urlModal, buttonToReplace);
						
					});

				});

		//});




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
				var clone=$("<div class='instrument button'></div>");
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
