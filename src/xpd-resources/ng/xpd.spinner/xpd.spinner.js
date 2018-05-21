(function () {

	'use strict';

	angular.module('xpd-spinner', ['angularSpinner']);

	angular.module('xpd-spinner').config(spinnerConfig);
	angular.module('xpd-spinner').factory('httpInterceptor', httpInterceptor);

	spinnerConfig.$inject = ['$httpProvider', 'usSpinnerConfigProvider'];

	function spinnerConfig($httpProvider, usSpinnerConfigProvider) {

		if (!document.getElementById('xpd-spinner')) {
			document.body.innerHTML += '<span us-spinner spinner-key="xpd-spinner"></span>';
		}

		$httpProvider.interceptors.push('httpInterceptor');

		usSpinnerConfigProvider.setDefaults({
			color: 'white'
		});

	}


	httpInterceptor.$inject = ['$q', 'usSpinnerService'];

	function httpInterceptor($q, usSpinnerService) {

		var numLoadings = 0;

		var urlsToExclude = [
			// '/xpd-setup-api/setup/reports/',
			// '/xpd-setup-api/setup/reading/from/',
			// '/xpd-setup-api/setup/reading/tick/',
			// '/xpd-setup-api/setup/event/list-by-type/',
			// '/xpd-setup-api/tripin/rig-pictures/load/'
		];

		function hasSpinner(url) {

			var result = true;

			for (var i in urlsToExclude) {
				if (url.indexOf(urlsToExclude[i]) >= 0) {
					result = false;
					break;
				}
			}

			return result;
		}

		return {
			request: function (config) {

				if (hasSpinner(config.url)) {
					numLoadings++;
					usSpinnerService.spin('xpd-spinner');
				}

				return config || $q.when(config);

			},
			response: function (response) {

				if (hasSpinner(response.config.url)) {
					if ((--numLoadings) === 0) {
						usSpinnerService.stop('xpd-spinner');
					}
				}

				return response || $q.when(response);

			},
			responseError: function (response) {

				if (hasSpinner(response.config.url)) {
					if (!(--numLoadings)) {
						usSpinnerService.stop('xpd-spinner');
					}
				}

				return $q.reject(response);
			}
		};
	}


})();
