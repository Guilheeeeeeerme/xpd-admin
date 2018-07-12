(function() {
	'use strict',

	angular.module('xpd.setupapi').service('photoAPIService', photoAPIService);

	photoAPIService.$inject = ['$http', 'xpdAccessFactory', 'setupAPIService'];

	function photoAPIService($http, xpdAccessFactory, setupAPIService) {

		let vm = this;

		vm.loadPhoto = loadPhoto;
		vm.uploadPhoto = uploadPhoto;

		function loadPhoto(path, name, successCallback, errorCallback) {

			let request = {
				method: 'GET',
				url: xpdAccessFactory.getSetupURL() + path + '/load/' + name,
				responseType: 'arraybuffer',
			};

			$http(request).then(
				function(response) {
					successCallback && successCallback(_arrayBufferToBase64(response.data));
				},
				function(error) {
					setupAPIService.generateToast(error);
					errorCallback && errorCallback(error);
				},
			);
		}

		function uploadPhoto(fd, path, successCallback, errorCallback) {

			// console.log(xpdAccessFactory.getSetupURL() + path + "/upload");
			// console.log("----------------");

			$http.post(xpdAccessFactory.getSetupURL() + path + '/upload', fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined,
				},
				transformRequest: angular.identity,
				params: {
					fd,
				},
			}).then(
				successCallback,
				function(error) {
					setupAPIService.generateToast(error);
					errorCallback && errorCallback(error);
				},
			);

		}

		// xpd-setup-api/tripin/rig-pictures/load/default

		function getObjectById(modelURL, id, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
				.then(
					function(response) {
						successCallback && successCallback(response.data);
					},
					function(error) {
						setupAPIService.generateToast(error);
						errorCallback && errorCallback(error);
					},
				);
		}

		function _arrayBufferToBase64(buffer) {
			let binary = '';
			let bytes = new Uint8Array(buffer);
			let len = bytes.byteLength;
			for (let i = 0; i < len; i++) {
				binary += String.fromCharCode(bytes[i]);
			}
			return window.btoa(binary);
		}

	}

})();
