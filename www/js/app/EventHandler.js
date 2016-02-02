define(function(require) {


	function EventHandler(){
	}

	EventHandler.prototype.Active = function(selector){

		selector.click(function(){
			$(selector).filter(".active").removeClass('active');
			$(this).addClass("active");
		})
	}

	return EventHandler;

});