(function() {
	'use strict';

	angular.module('xpd.admin').controller('MenuController', menuController);

	menuController.$inject = ['$scope', 'operationDataFactory', 'dialogFactory'];

	function menuController($scope, operationDataFactory, dialogFactory) {

		var vm = this;

		$scope.dados = {};

		operationDataFactory.operationData = [];

		$scope.operationData = operationDataFactory.operationData;

		vm.actionButtonSetBitDepthMode = actionButtonSetBitDepthMode;
		vm.actionButtonSetBitDepth = actionButtonSetBitDepth;
		vm.actionButtonSetSlipsThreshold = actionButtonSetSlipsThreshold;
		vm.actionButtonSetBlockWeight = actionButtonSetBlockWeight;
		vm.actionButtonSetStickUp = actionButtonSetStickUp;
		vm.actionButtonSetDelayOnUnreachable = actionButtonSetDelayOnUnreachable;
		vm.actionButtonSetBlockSpeedInterval = actionButtonSetBlockSpeedInterval;

		function actionButtonSetBitDepthMode(mode) {
			var message = 'Change bit depth provider to ' + ((mode) ? 'XPD' : 'Rig') + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBitDepthMode(mode);
			});
		}

		function actionButtonSetBitDepth(bitDepth) {
			var message = 'Update bit depth to ' + bitDepth + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBitDepth(bitDepth);
			});

		}

		function actionButtonSetBlockWeight(blockWeight) {
			var message = 'Update block weight to ' + blockWeight + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateBlockWeight(blockWeight);
			});

		}

		function actionButtonSetSlipsThreshold(threshold) {
			var message = 'Update slips threshold to ' + threshold + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateSlipsThreshold(threshold);
			});

		}

		function actionButtonSetStickUp(stickUp) {
			var message = 'Update stick up to ' + stickUp + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateStickUp(stickUp);
			});

		}

		function actionButtonSetDelayOnUnreachable(seconds) {
			var message = 'Change delay seconds on unreachable target to ' + seconds + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetDelayOnUnreachableCheck(seconds);
			});
		}

		function actionButtonSetBlockSpeedInterval(interval) {
			var message = 'Change interval on block speed to ' + interval + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBlockSpeedInterval(interval);
			});
		}
	}

})();