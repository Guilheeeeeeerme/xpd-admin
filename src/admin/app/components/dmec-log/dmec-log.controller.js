
(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', 'dmecService'];

	function DMecLogController($scope, dmecService){
		dmecService.dmec($scope, 'xpd.dmec.log.dmecInputRangeForm');
		$scope.initializeComponent();
	}

})();

