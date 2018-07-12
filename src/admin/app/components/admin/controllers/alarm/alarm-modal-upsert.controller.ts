/*
* @Author:
* @Date:   2017-06-08 12:43:52
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-06-13 18:00:57
*/
(function() {

	'use strict';

	angular.module('xpd.admin').controller('AlarmModalUpsertController', alarmModalUpsertController);

	alarmModalUpsertController.$inject = ['$scope', '$filter', '$uibModalInstance', 'operation', 'alarm', 'actionButtonSaveCallback', 'actionButtonCloseCallback'];

	function alarmModalUpsertController($scope, $filter, $uibModalInstance, $operation, $alarm, actionButtonSaveCallback, actionButtonCloseCallback) {

		const vm = this;

		vm.actionButtonClose = actionButtonClose;
		vm.actionButtonSave = actionButtonSave;

		vm.init = init;

		$scope.operation = $operation;
		$scope.alarm = $alarm;

		if (!$scope.alarm.timeSlices) {

			$scope.alarm.timeSlices = {
				tripin: [],
				tripout: [],
			};

		} else {

			$scope.alarm.timeSlices = {
				tripin: $filter('orderBy')($filter('filter')($scope.alarm.timeSlices, { tripin: true, enabled: true }), 'timeOrder'),
				tripout: $filter('orderBy')($filter('filter')($scope.alarm.timeSlices, { tripin: false, enabled: true }), 'timeOrder'),
			};

		}

		init();

		function init() {
			if ($scope.operation.type == 'time') {
				$scope.alarm.alarmType = 'time';
			}
		}

		function actionButtonSave() {

			$scope.alarm.timeSlices = $scope.alarm.timeSlices.tripin.concat($scope.alarm.timeSlices.tripout);

			actionButtonSaveCallback && actionButtonSaveCallback($scope.alarm);

			$uibModalInstance.close();
		}

		function actionButtonClose() {
			actionButtonCloseCallback && actionButtonCloseCallback();
			$uibModalInstance.close();
		}

	}
})();
