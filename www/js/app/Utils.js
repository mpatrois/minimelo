'use strict';

var DEBUG_MODE = 1;

$(document).ready(function() {
	if(DEBUG_MODE == 1) {
		$('.app').first().append('<div id="debug"></div>');
	}
})

var debug = function(txt) {
  var debug = $('#debug');
  debug.append('<p>' + txt + '</p>');

  if(debug.children().size() > 50) {
    debug.children().first().remove();
  }
}