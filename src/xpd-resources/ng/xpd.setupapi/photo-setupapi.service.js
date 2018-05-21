(function () {
	'use strict',

	angular.module('xpd.setupapi').service('photoAPIService', photoAPIService);

	photoAPIService.$inject = ['$http', 'xpdAccessFactory'];

	function photoAPIService($http, xpdAccessFactory) {

		var vm = this;

		vm.loadPhoto = loadPhoto;
		vm.uploadPhoto = uploadPhoto;

		function loadPhoto(path, name, successCallback, errorCallback) {

			var request = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + path + '/load/' + name,
				responseType: 'arraybuffer'
			};

			$http(request).then(
				function (response) {
					successCallback && successCallback(_arrayBufferToBase64(response.data));
				},
				function (error) {
					errorCallback && errorCallback(error);
				}
			);
		}

		function uploadPhoto(fd, path, successCallback, errorCallback) {

			//console.log(xpdAccessFactory.getSetupURL() + path + "/upload");
			//console.log("----------------");

			$http.post(xpdAccessFactory.getSetupURL() + path + '/upload', fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined
				},
				transformRequest: angular.identity,
				params: {
					fd: fd
				}
			}).then(successCallback, errorCallback);

		}

		// xpd-setup-api/tripin/rig-pictures/load/default


		function getObjectById(modelURL, id, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function (response) {
						successCallback && successCallback(response.data);
					},
					function (error) {
						errorCallback && errorCallback(error);
					}
				);
		}

		function _arrayBufferToBase64(buffer) {
			var binary = '';
			var bytes = new Uint8Array(buffer);
			var len = bytes.byteLength;
			for (var i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			return window.btoa(binary);
		}

	}

})();
