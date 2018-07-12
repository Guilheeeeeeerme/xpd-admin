(function() {
	'use strict';

	angular.module('xpd.admin').controller('MenuController', menuController);

	menuController.$inject = ['$scope', 'operationDataFactory', 'dialogFactory'];

	function menuController($scope, operationDataFactory, dialogFactory) {

		const vm = this;

		$scope.dados = {};

		operationDataFactory.openConnection([]).then(function(response) {
			operationDataFactory = response;
			$scope.operationData = operationDataFactory.operationData;
		});

		vm.actionButtonSetBitDepthMode = actionButtonSetBitDepthMode;
		vm.actionButtonSetBitDepth = actionButtonSetBitDepth;
		vm.actionButtonSetSlipsThreshold = actionButtonSetSlipsThreshold;
		vm.actionButtonSetBlockWeight = actionButtonSetBlockWeight;
		vm.actionButtonSetStickUp = actionButtonSetStickUp;
		vm.actionButtonSetDelayOnUnreachable = actionButtonSetDelayOnUnreachable;
		vm.actionButtonSetBlockSpeedInterval = actionButtonSetBlockSpeedInterval;

		function actionButtonSetBitDepthMode(mode) {
			const message = 'Change bit depth provider to ' + ((mode) ? 'XPD' : 'Rig') + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBitDepthMode(mode);
			});
		}

		function actionButtonSetBitDepth(bitDepth) {
			const message = 'Update bit depth to ' + bitDepth + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBitDepth(bitDepth);
			});

		}

		function actionButtonSetBlockWeight(blockWeight) {
			const message = 'Update block weight to ' + blockWeight + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateBlockWeight(blockWeight);
			});

		}

		function actionButtonSetSlipsThreshold(threshold) {
			const message = 'Update slips threshold to ' + threshold + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateSlipsThreshold(threshold);
			});

		}

		function actionButtonSetStickUp(stickUp) {
			const message = 'Update stick up to ' + stickUp + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitUpdateStickUp(stickUp);
			});

		}

		function actionButtonSetDelayOnUnreachable(seconds) {
			const message = 'Change delay seconds on unreachable target to ' + seconds + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetDelayOnUnreachableCheck(seconds);
			});
		}

		function actionButtonSetBlockSpeedInterval(interval) {
			const message = 'Change interval on block speed to ' + interval + '?';

			dialogFactory.showCriticalDialog(message, function() {
				operationDataFactory.emitSetBlockSpeedInterval(interval);
			});
		}
	}

})();
