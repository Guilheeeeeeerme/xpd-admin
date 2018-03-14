(function() {
	'use strict',

	angular.module('xpd.setupapi')
		.service('setupAPIService', setupAPIService)
		.config(function(toastrConfig) {
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

	setupAPIService.$inject = ['$http', 'xpdAccessFactory','toastr'];

	function setupAPIService($http, xpdAccessFactory, toastr) {

		var vm = this;

		vm.getList = getList;
		vm.insertObject = insertObject;
		vm.removeObject = removeObject;
		vm.updateObject = updateObject;
		vm.getObjectById = getObjectById;
		vm.generateToast = generateToast;

		function getObjectById(modelURL, id, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/' + id)
            	.then(
	            function(data) {
	                successCallback && successCallback(data.data);
	            },
	            function(error){
	            	generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function getList(modelURL, successCallback, errorCallback) {
			$http.get(xpdAccessFactory.getSetupURL() + modelURL + '/list')
            	.then(
	            function(data) {
	                successCallback && successCallback(data.data);
	            },
	            function(error){
	            	generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
				);
		}

		function insertObject(modelURL, object, successCallback, errorCallback) {

			var req = {
				method: 'POST',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
	            function(data) {
	                generateToast(data.data, false);
	                successCallback && successCallback(data.data);
	            },
	            function(error){
	            	generateToast(error.data, true);
	                errorCallback && errorCallback(error);
            	}
			);

		}

		function removeObject(modelURL, object, successCallback, errorCallback) {

			var req = {
				method: 'DELETE',
				url: xpdAccessFactory.getSetupURL() + modelURL,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(function(data) {
				generateToast(data.data, false);
				successCallback && successCallback(data.data);
			}, function(error){
				generateToast(error.data, true);
				errorCallback && errorCallback(error);
			});
		}

		function updateObject(modelURL, object, successCallback, errorCallback) {

			var req = {
				method: 'PUT',
				url: xpdAccessFactory.getSetupURL() + modelURL + '/' + object.id,
				headers: {
					'Content-Type': 'application/json'
				},
				data: object
			};

			$http(req).then(
	            function(data) {
	                successCallback && successCallback(data.data);
	                generateToast(data.data, false);
	            },
	            function(error){
	                generateToast(error.data, true);
	                errorCallback && errorCallback(error);
	            }
			);
		}

		function generateToast(data, error){

			if(!error) {
				toastr.success(data.message);
			} else{

				if(!data){
					data = {
						message: 'Insecure Response'
					};
				}

				if(!data.message){
					
					data = {
						message: data
					};
					
					data.message = data.message.split('<body>')[1];
					data.message = data.message.split('</body>')[0];
					
					data.message = data.message.replace(/<[^>]*>/g, '\n');
				}

				toastr.error(data.message);
			}
		}

	}

})();
