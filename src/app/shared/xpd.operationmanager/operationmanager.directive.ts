// (function() {
// 	'use strict';

// 	angular.module('xpd.operationmanager', []).directive('xpdOperationManager', xpdOperationManager);

// 	xpdOperationManager.$inject = ['$uibModal', 'dialogService'];
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import template from './operationmanager.template.html';

export class XPDOperationManagerDirective {

	public static $inject: string[] = ['$uibModal', 'dialogService'];

	public scope = {
		currentOperation: '=',
		operationQueue: '=',
		lastSection: '=',
		currentAlarm: '=',
		currentState: '=',
		currentEvent: '=',
		currentDirection: '=',
		bitDepthContext: '=',
		popoverPlacement: '@',
		actionButtonStartOperation: '=',
		actionButtonFinishOperation: '=',
		actionButtonStartCementation: '=',
		actionButtonStopCementation: '=',
		actionButtonStartMakeUp: '=',
		actionButtonStartLayDown: '=',
		actionButtonFinishMakeUp: '=',
		actionButtonFinishLayDown: '=',
		actionButtonFinishDurationAlarm: '=',
	};

	public restrict = 'EA';
	public template = template;

	constructor(private $uibModal: IModalService, private dialogService: DialogService) {

	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		scope.stacked = (attrs.display === 'stacked');

		scope.clickStartOperation = clickStartOperation;
		scope.closeModal = closeModal;
		scope.onClickOK = onClickOK;

		scope.onClickStartMakeUp = onClickStartMakeUp;
		scope.onClickStartLayDown = onClickStartLayDown;
		scope.onClickFinishMakeUp = onClickFinishMakeUp;
		scope.onClickFinishLayDown = onClickFinishLayDown;
		scope.actionDisabledCementation = actionDisabledCementation;
		scope.onClickFinishDurationAlarm = onClickFinishDurationAlarm;

		const modalBitDepth = null;

		if (!attrs.view || attrs.view !== 'driller') {
			scope.drillerView = false;
		} else {
			scope.drillerView = true;
		}

		function clickStartOperation() {

			scope.actionButtonStartOperation(scope.currentOperation);

			// if (scope.currentOperation.type == 'riser') {
			// 	if (scope.currentOperation.metaType == 'ascentRiser') {
			// 		scope.startBitDepth = scope.currentOperation.startHoleDepth;
			// 		scope.currentOperation.tripin = false;
			// 	} else {
			// 		scope.startBitDepth = scope.currentOperation.startBitDepth;
			// 	}
			// } else {
			// 	scope.startBitDepth = scope.currentOperation.startBitDepth;
			// }

			// // scope.startBitDepth = scope.currentOperation.startBitDepth;

			// modalBitDepth = $uibModal.open({
			// 	keyboard: false,
			// 	backdrop: 'static',
			// 	animation: true,
			// 	size: 'md',
			// 	templateUrl: '../xpd-resources/ng/xpd.operationmanager/start-operation-dialog.view.html',
			// 	scope: scope

			// });
		}

		function closeModal() {
			modalBitDepth.close();
		}

		function onClickOK(operation, startBitDepth) {
			closeModal();
			operation.startBitDepth = startBitDepth;
			scope.actionButtonStartOperation(operation);
		}

		function onClickStartMakeUp() {
			self.dialogService.showCriticalDialog('Are you sure you want to start ' + checkIsBhaOrBOP() + ' Make Up?', startMakeUp);
		}

		function onClickStartLayDown() {
			self.dialogService.showCriticalDialog('This action will start ' + checkIsBhaOrBOP() + ' Lay Down. Are you sure you want to do this?', startLayDown);
		}

		function onClickFinishMakeUp() {
			if (scope.bitDepthContext.bitDepth < scope.currentOperation.length) {
				messageBitDepth(scope.currentOperation.length);
			} else {
				self.dialogService.showCriticalDialog({ templateHtml: 'This action will set bit depth at <b>' + scope.currentOperation.length + '</b>m. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Make Up?' }, finishMakeUp);
			}

		}

		function onClickFinishLayDown() {
			self.dialogService.showCriticalDialog({ templateHtml: 'This action will end operation. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Lay Down?' }, finishLayDown);
		}

		function actionDisabledCementation() {
			messageBitDepth((scope.currentOperation.endBitDepth - scope.currentOperation.length));
		}

		function onClickFinishDurationAlarm() {
			self.dialogService.showConfirmDialog('Are you sure you want to finish this duration alarm? This action cannot be undone.', scope.actionButtonFinishDurationAlarm);
		}

		function checkIsBhaOrBOP() {
			return (scope.currentOperation.type === 'bha' ? 'BHA' : 'BOP');
		}

		function startMakeUp() {
			self.dialogService.showConfirmDialog('Are you sure you want to start Make Up? This action cannot be undone.', scope.actionButtonStartMakeUp);
		}

		function startLayDown() {
			self.dialogService.showConfirmDialog('Are you sure you want to start Lay Down? This action cannot be undone.', scope.actionButtonStartLayDown);
		}

		function finishMakeUp() {
			self.dialogService.showConfirmDialog('Are you sure you want to finish Make Up? This action cannot be undone.', scope.actionButtonFinishMakeUp);
		}

		function finishLayDown() {
			self.dialogService.showConfirmDialog('Are you sure you want to finish Lay Down? This action cannot be undone.', scope.actionButtonFinishLayDown);
		}

		function messageBitDepth(acceptableBitDepth) {
			let bitDepthOrigin;

			if (scope.bitDepthContext.usingXpd) {
				bitDepthOrigin = 'XPD';
			} else {
				bitDepthOrigin = 'RIG';
			}

			self.dialogService.showMessageDialog({
				templateHtml: 'You are using <b>' + bitDepthOrigin + '</b> bit depth, and your current position is <b>' + scope.bitDepthContext.bitDepth + '</b>m,  please move the bit depth to <b>' + acceptableBitDepth + '</b>m to proceed.',
			});
		}

		scope.operationQueuePopover = {
			templateUrl: 'operationmanager.template.html',
			title: 'Operation Queue',
		};
	}

	public static Factory(): ng.IDirectiveFactory {
		return ($uibModal: IModalService, dialogService: DialogService) => new XPDOperationManagerDirective($uibModal, dialogService);
	}

}

// })();
