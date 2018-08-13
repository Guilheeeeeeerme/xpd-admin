// (function() {
// 	'use strict';

// 	xpdOperationManager.$inject = ['$uibModal', 'dialogService'];
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import './operationmanager.style.scss';
import template from './operationmanager.template.html';

export class XPDOperationManagerDirective {

	public static $inject: string[] = ['$uibModal', 'dialogService'];

	public static Factory(): ng.IDirectiveFactory {
		return ($uibModal: IModalService, dialogService: DialogService) => new XPDOperationManagerDirective($uibModal, dialogService);
	}

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

		actionButtonStartOperation: '&',
		actionButtonFinishOperation: '&',
		actionButtonStartCementation: '&',
		actionButtonStopCementation: '&',
		actionButtonStartMakeUp: '&',
		actionButtonStartLayDown: '&',
		actionButtonFinishMakeUp: '&',
		actionButtonFinishLayDown: '&',
		actionButtonFinishDurationAlarm: '&',
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

		scope.stacked = (attrs.display === 'stacked');

		const modalBitDepth = null;

		if (!attrs.view || attrs.view !== 'driller') {
			scope.drillerView = false;
		} else {
			scope.drillerView = true;
		}

		const clickStartOperation = () => {

			scope.actionButtonStartOperation({ operation: scope.currentOperation });

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
		};

		const closeModal = () => {
			modalBitDepth.close();
		};

		const onClickOK = (operation, startBitDepth) => {
			closeModal();
			operation.startBitDepth = startBitDepth;
			scope.actionButtonStartOperation(operation);
		};

		const onClickStartMakeUp = () => {
			this.dialogService.showCriticalDialog('Are you sure you want to start ' + checkIsBhaOrBOP() + ' Make Up?', startMakeUp);
		};

		const onClickStartLayDown = () => {
			this.dialogService.showCriticalDialog('This action will start ' + checkIsBhaOrBOP() + ' Lay Down. Are you sure you want to do this?', startLayDown);
		};

		const onClickFinishMakeUp = () => {
			if (scope.bitDepthContext.bitDepth < scope.currentOperation.length) {
				messageBitDepth(scope.currentOperation.length);
			} else {
				this.dialogService.showCriticalDialog({ templateHtml: 'This action will set bit depth at <b>' + scope.currentOperation.length + '</b>m. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Make Up?' }, finishMakeUp);
			}

		};

		const onClickFinishLayDown = () => {
			this.dialogService.showCriticalDialog({ templateHtml: 'This action will end operation. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Lay Down?' }, finishLayDown);
		};

		const actionDisabledCementation = () => {
			messageBitDepth((scope.currentOperation.endBitDepth - scope.currentOperation.length));
		};

		const onClickFinishDurationAlarm = () => {
			this.dialogService.showConfirmDialog('Are you sure you want to finish this duration alarm? This action cannot be undone.', scope.actionButtonFinishDurationAlarm);
		};

		const checkIsBhaOrBOP = () => {
			return (scope.currentOperation.type === 'bha' ? 'BHA' : 'BOP');
		};

		const startMakeUp = () => {
			this.dialogService.showConfirmDialog('Are you sure you want to start Make Up? This action cannot be undone.', scope.actionButtonStartMakeUp);
		};

		const startLayDown = () => {
			this.dialogService.showConfirmDialog('Are you sure you want to start Lay Down? This action cannot be undone.', scope.actionButtonStartLayDown);
		};

		const finishMakeUp = () => {
			this.dialogService.showConfirmDialog('Are you sure you want to finish Make Up? This action cannot be undone.', scope.actionButtonFinishMakeUp);
		};

		const finishLayDown = () => {
			this.dialogService.showConfirmDialog('Are you sure you want to finish Lay Down? This action cannot be undone.', scope.actionButtonFinishLayDown);
		};

		const messageBitDepth = (acceptableBitDepth) => {
			let bitDepthOrigin;

			if (scope.bitDepthContext.usingXpd) {
				bitDepthOrigin = 'XPD';
			} else {
				bitDepthOrigin = 'RIG';
			}

			this.dialogService.showMessageDialog({
				templateHtml: 'You are using <b>' + bitDepthOrigin + '</b> bit depth, and your current position is <b>' + scope.bitDepthContext.bitDepth + '</b>m,  please move the bit depth to <b>' + acceptableBitDepth + '</b>m to proceed.',
			});
		};

		scope.operationQueuePopover = {
			templateUrl: 'operationmanager.template.html',
			title: 'Operation Queue',
		};

		scope.clickStartOperation = (arg) => { clickStartOperation(); };
		scope.closeModal = (arg) => { closeModal(); };
		scope.onClickOK = (operation, startBitDepth) => { onClickOK(operation, startBitDepth); };

		scope.onClickStartMakeUp = (arg) => { onClickStartMakeUp(); };
		scope.onClickStartLayDown = (arg) => { onClickStartLayDown(); };
		scope.onClickFinishMakeUp = (arg) => { onClickFinishMakeUp(); };
		scope.onClickFinishLayDown = (arg) => { onClickFinishLayDown(); };
		scope.actionDisabledCementation = (arg) => { actionDisabledCementation(); };
		scope.onClickFinishDurationAlarm = (arg) => { onClickFinishDurationAlarm(); };

	}

}

// })();
