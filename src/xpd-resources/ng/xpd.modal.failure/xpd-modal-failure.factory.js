(function () {
	'use strict';

	angular.module('xpd.modal-failure').factory('failureModal', failureModal);

	failureModal.$inject = ['$uibModal'];

	function failureModal($uibModal) {

		return {
			open: open
		};

		function open(selectedFailure){

			if(selectedFailure.startTime)
				selectedFailure.startTime = new Date(selectedFailure.startTime);

			if(selectedFailure.endTime)
				selectedFailure.endTime = new Date(selectedFailure.endTime);

			return $uibModal.open({
				keyboard: false,
				backdrop: 'static',
				templateUrl: '../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.template.html',
				windowClass: 'xpd-operation-modal',
				controller: 'modalFailureController as mfController',
				size: 'modal-md',
				resolve: {
					selectedFailure: function(){
						return selectedFailure;
					}
				}
			});
		}
		
	}

})();
