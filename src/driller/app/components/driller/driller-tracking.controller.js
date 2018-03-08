(function () {
	'use strict',

	angular.module('xpd.drillerTracking').controller('DrillerTrackingController', drillerTrackingController);

	drillerTrackingController.$inject = ['$scope', '$rootScope'];

	function drillerTrackingController($scope, $rootScope) {

		var vm = this;

		$rootScope.XPDmodule = '';
	}

})();
