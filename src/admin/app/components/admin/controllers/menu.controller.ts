import { OperationDataFactory } from '../../../../../xpd-resources/ng/xpd.communication/operation-server-data.factory';
import { DialogFactory } from '../../../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';

export class MenuController {
	// 'use strict';

	// angular.module('xpd.admin').controller('MenuController', menuController);

	public static $inject = ['$scope', 'operationDataFactory', 'dialogFactory'];
	public operationDataFactory: any;
	public actionButtonSetBitDepthMode: (mode: any) => void;
	public actionButtonSetBitDepth: (bitDepth: any) => void;
	public actionButtonSetSlipsThreshold: (threshold: any) => void;
	public actionButtonSetBlockWeight: (blockWeight: any) => void;
	public actionButtonSetStickUp: (stickUp: any) => void;
	public actionButtonSetDelayOnUnreachable: (seconds: any) => void;
	public actionButtonSetBlockSpeedInterval: (interval: any) => void;

	constructor($scope, operationDataFactory: OperationDataFactory, dialogFactory: DialogFactory) {

		const vm = this;

		$scope.dados = {};

		operationDataFactory.openConnection([]).then(function(response) {
			vm.operationDataFactory = response;
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
				vm.operationDataFactory.emitSetBitDepthMode(mode);
			});
		}

		function actionButtonSetBitDepth(bitDepth) {
			const message = 'Update bit depth to ' + bitDepth + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetBitDepth(bitDepth);
			});

		}

		function actionButtonSetBlockWeight(blockWeight) {
			const message = 'Update block weight to ' + blockWeight + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateBlockWeight(blockWeight);
			});

		}

		function actionButtonSetSlipsThreshold(threshold) {
			const message = 'Update slips threshold to ' + threshold + 'klb ?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateSlipsThreshold(threshold);
			});

		}

		function actionButtonSetStickUp(stickUp) {
			const message = 'Update stick up to ' + stickUp + 'm ?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateStickUp(stickUp);
			});

		}

		function actionButtonSetDelayOnUnreachable(seconds) {
			const message = 'Change delay seconds on unreachable target to ' + seconds + '?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetDelayOnUnreachableCheck(seconds);
			});
		}

		function actionButtonSetBlockSpeedInterval(interval) {
			const message = 'Change interval on block speed to ' + interval + '?';

			dialogFactory.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetBlockSpeedInterval(interval);
			});
		}
	}

}
