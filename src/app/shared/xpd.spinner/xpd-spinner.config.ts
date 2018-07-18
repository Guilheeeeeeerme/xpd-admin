export class SpinnerConfig {
	public static $inject: string[] = ['usSpinnerConfigProvider'];

	constructor(usSpinnerConfigProvider: any) {

		if (!document.getElementById('xpd-spinner')) {
			document.body.innerHTML += '<span us-spinner spinner-key="xpd-spinner"></span>';
		}

		// $httpProvider.interceptors.push('httpInterceptor');

		// var opts = {
		// 	color: 'white'
		// };

		const opts = {
			lines: 13, // The number of lines to draw
			length: 38, // The length of each line
			width: 17, // The line thickness
			radius: 45, // The radius of the inner circle
			scale: 0.3, // Scales overall size of the spinner
			corners: 1, // Corner roundness (0..1)
			color: '#ffffff', // CSS color or array of colors
			fadeColor: 'transparent', // CSS color or array of colors
			speed: 1, // Rounds per second
			rotate: 0, // The rotation offset
			animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
			direction: 1, // 1: clockwise, -1: counterclockwise
			zIndex: 2e9, // The z-index (defaults to 2000000000)
			className: 'spinner', // The CSS class to assign to the spinner
			top: '90%', // Top position relative to parent
			left: '50%', // Left position relative to parent
			shadow: '0 0 1px transparent', // Box-shadow for the lines
			position: 'absolute', // Element positioning
		};

		usSpinnerConfigProvider.setDefaults(opts);

	}

}

// (function() {

// 	'use strict';

// 	app.config(spinnerConfig);

// 	spinnerConfig.$inject = ['usSpinnerConfigProvider'];

// 	// app.factory('httpInterceptor', httpInterceptor);
// 	// httpInterceptor.$inject = ['$q', 'usSpinnerService'];

// 	// function httpInterceptor($q, usSpinnerService) {

// 	// 	var numLoadings = 0;

// 	// 	var urlsToExclude = [
// 	// 		// '/xpd-setup-api/setup/reports/',
// 	// 		// '/xpd-setup-api/setup/reading/from/',
// 	// 		// '/xpd-setup-api/setup/reading/tick/',
// 	// 		// '/xpd-setup-api/setup/event/list-by-type/',
// 	// 		// '/xpd-setup-api/tripin/rig-pictures/load/'
// 	// 	];

// 	// 	function hasSpinner(url) {

// 	// 		var result = true;

// 	// 		for (var i in urlsToExclude) {
// 	// 			if (url.indexOf(urlsToExclude[i]) >= 0) {
// 	// 				result = false;
// 	// 				break;
// 	// 			}
// 	// 		}

// 	// 		return result;
// 	// 	}

// 	// 	return {
// 	// 		request: function (config) {

// 	// 			// if (hasSpinner(config.url)) {
// 	// 			// 	numLoadings++;
// 	// 			// 	usSpinnerService.spin('xpd-spinner');
// 	// 			// }

// 	// 			return config || $q.when(config);

// 	// 		},
// 	// 		response: function (response) {

// 	// 			// if (hasSpinner(response.config.url)) {
// 	// 			// 	if ((--numLoadings) === 0) {
// 	// 			// 		usSpinnerService.stop('xpd-spinner');
// 	// 			// 	}
// 	// 			// }

// 	// 			return response || $q.when(response);

// 	// 		},
// 	// 		responseError: function (response) {

// 	// 			// if (hasSpinner(response.config.url)) {
// 	// 			// 	if (!(--numLoadings)) {
// 	// 			// 		usSpinnerService.stop('xpd-spinner');
// 	// 			// 	}
// 	// 			// }

// 	// 			return $q.reject(response);
// 	// 		}
// 	// 	};
// 	// }

// })();
