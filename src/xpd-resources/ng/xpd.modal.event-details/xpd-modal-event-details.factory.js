(function () {
	'use strict';

	angular.module('xpd.modal-event-details').factory('eventDetailsModal', eventDetailsModal);

	eventDetailsModal.$inject = ['$uibModal'];

	function eventDetailsModal($uibModal) {

		return {
			open: open
		};

		function open(selectedEvent){

			return $uibModal.open({
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				windowClass: 'xpd-operation-modal',
				templateUrl: '../xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.template.html',
				controller: 'modalEventDetailsController as medController',
				resolve: {
					selectedEvent: function () {
						return selectedEvent;
					}
				}
			});
		}
		
	}

})();
