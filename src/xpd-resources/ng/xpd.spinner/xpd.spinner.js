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
			'/xpd-setup-api/setup/reading/from/',
			'/xpd-setup-api/setup/reading/tick/'
		];

		function hasSpinner(url) {

			for (var i in urlsToExclude) {
				if (url.indexOf(urlsToExclude[i]) >= 0) {
					return false;
				}
			}

			return true;
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
						//console.log('Hide loader');
						usSpinnerService.stop('xpd-spinner');
					}
				}

				return response || $q.when(response);

			},
			responseError: function (response) {

				if (!(--numLoadings)) {
					//console.log('Hide loader');
					usSpinnerService.stop('xpd-spinner');
				}

				return $q.reject(response);
			}
		};
	}


})();
