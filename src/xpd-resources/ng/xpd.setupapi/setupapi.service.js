(function () {
	'use strict',

		angular.module('xpd.setupapi')
			.service('setupAPIService', setupAPIService)
			.config(function (toastrConfig) {
				angular.extend(toastrConfig, {
					autoDismiss: true,
					extendedTimeOut: 3000,
					maxOpened: 4,
					newestOnTop: true,
					preventOpenDuplicates: true,
					tapToDismiss: true,
					timeOut: 2000,
					positionClass: 'toast-bottom-center',
				});
			});

	setupAPIService.$inject = ['$http', 'xpdAccessFactory', 'toastr'];

	function setupAPIService($http, xpdAccessFactory, toastr) {

		var vm = this;

		vm.generateToast = generateToast;
		vm.doRequest = doRequest;

		function doRequest(req, successCallback, errorCallback) {

			$http(req).then(
				function (response) {
					// console.log( angular.copy( { req: req, response: response} ) );

					if ( response && response.data && (response.data.isWrappedResponse || response.data.timestamp) ) {
						successCallback && successCallback(response.data.data);
					} else {
						successCallback && successCallback(response.data);
					}

				},
				function (error) {
					// console.log( angular.copy( { req: req, response: error} ) );

					generateToast(error, true);
					errorCallback && errorCallback(error);
				}
			);
		}

		function generateToast(error, showError) {

			if (!showError) {
				toastr.success(error.message);
			} else {				

				if (!error) {
					error = {};
					error.data = {
						message: 'Insecure Response'
					};
				}

				// if (!error.data.message) {

				// 	error = {
				// 		message: error
				// 	};

				// 	error.message = error.message.split('<body>')[1];
				// 	error.message = error.message.split('</body>')[0];

				// 	error.message = error.message.replace(/<[^>]*>/g, '\n');
				// }

				toastr.error(error.data.message);
			}
		}
	}

})();