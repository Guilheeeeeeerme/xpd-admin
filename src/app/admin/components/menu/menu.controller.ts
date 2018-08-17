import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';

export class MenuController {
	// 'use strict';

	public static $inject = ['$scope', 'operationDataService', 'dialogService'];
	public operationDataFactory: any;
	public actionButtonSetBitDepthMode: (mode: any) => void;
	public actionButtonSetBitDepth: (bitDepth: any) => void;
	public actionButtonSetSlipsThreshold: (threshold: any) => void;
	public actionButtonSetBlockWeight: (blockWeight: any) => void;
	public actionButtonSetStickUp: (stickUp: any) => void;
	public actionButtonSetDelayOnUnreachable: (seconds: any) => void;
	public actionButtonSetBlockSpeedInterval: (interval: any) => void;

	constructor($scope, operationDataService: OperationDataService, dialogService: DialogService) {

		const vm = this;

		$scope.dados = {};

		operationDataService.openConnection([
				'alarm',
				'bitDepth',
				'dataAcquisition',
				'operation',
				'reading',
				'speedSecurity',
			]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;
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

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetBitDepthMode(mode);
			});
		}

		function actionButtonSetBitDepth(bitDepth) {
			const message = 'Update bit depth to ' + bitDepth + 'm ?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetBitDepth(bitDepth);
			});

		}

		function actionButtonSetBlockWeight(blockWeight) {
			const message = 'Update block weight to ' + blockWeight + 'klb ?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateBlockWeight(blockWeight);
			});

		}

		function actionButtonSetSlipsThreshold(threshold) {
			const message = 'Update slips threshold to ' + threshold + 'klb ?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateSlipsThreshold(threshold);
			});

		}

		function actionButtonSetStickUp(stickUp) {
			const message = 'Update stick up to ' + stickUp + 'm ?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitUpdateStickUp(stickUp);
			});

		}

		function actionButtonSetDelayOnUnreachable(seconds) {
			const message = 'Change delay seconds on unreachable target to ' + seconds + '?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetDelayOnUnreachableCheck(seconds);
			});
		}

		function actionButtonSetBlockSpeedInterval(interval) {
			const message = 'Change interval on block speed to ' + interval + '?';

			dialogService.showCriticalDialog(message, function() {
				vm.operationDataFactory.emitSetBlockSpeedInterval(interval);
			});
		}
	}

}
