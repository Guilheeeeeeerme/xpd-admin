
(function () {

	'use strict';

	addEventListener('message', onEvent, false);

	function onEvent(event) {
		var data = event.data;
		var self = this;

		switch (data.cmd) {

		case 'interval':
			setInterval(function(){
				self.postMessage('interval');
			}, data.timeout);
			break;
		case 'timeout':
			setTimeout(function(){
				self.postMessage('timeout');
			}, data.timeout);
			break;
		default:
			console.log('[Worker] Unable to handle ', data);
			break;
		}

	}

})();