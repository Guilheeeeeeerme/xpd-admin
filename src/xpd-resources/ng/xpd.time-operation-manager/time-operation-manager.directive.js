(function () {
	'use strict';

	angular.module('xpd.time-operation-manager', ['xpd.communication']).directive('xpdTimeOperationManager', xpdTimeOperationManager);

	xpdTimeOperationManager.$inject = ['$uibModal', 'dialogFactory', 'operationDataFactory'];

	function xpdTimeOperationManager($uibModal, dialogFactory, operationDataFactory) {

		return {
			scope: {
				'view':'='
			},
			restrict: 'EA',
			link: link,
			templateUrl: '../xpd-resources/ng/xpd.time-operation-manager/time-operation-manager.template.html'
		};

		function link(scope, elem, attrs) {
			
			scope.view = attrs.view;

			operationDataFactory.operationData = [];
			scope.operationData = operationDataFactory.operationData;

			scope.$watch('operationData.operationContext', (context) => {
				scope.currentOperation = context.currentOperation;
			}, true);

			scope.$watch('operationData.stateContext', (context) => {
				scope.currentState = context.currentState;
			}, true);

			scope.$watch('operationData.directionContext', (context) => {
				scope.currentDirection = context;
			}, true);

			scope.$watch('operationData.alarmContext', (context) => {
				scope.currentAlarm = context.currentAlarm;
			}, true);

			scope.closeModal = closeModal;
			scope.onClickOK = onClickOK;

			scope.onClickStartMakeUp = onClickStartMakeUp;
			scope.onClickStartLayDown = onClickStartLayDown;
			scope.onClickFinishMakeUp = onClickFinishMakeUp;
			scope.onClickFinishLayDown = onClickFinishLayDown;
			scope.onClickStopCementation = onClickStopCementation;
			scope.onClickFinishDurationAlarm = onClickFinishDurationAlarm;

			scope.actionButtonStartCementation = actionButtonStartCementation;
			scope.actionButtonStopCementation = actionButtonStopCementation;
			scope.actionDisabledCementation = actionDisabledCementation;
			scope.actionButtonStartMakeUp = actionButtonStartMakeUp;
			scope.actionButtonStartLayDown = actionButtonStartLayDown;
			scope.actionButtonFinishMakeUp = actionButtonFinishMakeUp;
			scope.actionButtonFinishLayDown = actionButtonFinishLayDown;
			scope.actionButtonFinishDurationAlarm = actionButtonFinishDurationAlarm;
			
			var modalInstance;

			function closeModal(){
				try{
					modalInstance.close();
				}catch(e){
					console.error(e);
				}
			}

			function onClickOK(operation, startBitDepth){
				closeModal();
				operation.startBitDepth = startBitDepth;
				scope.actionButtonStartOperation(operation);
			}

			function onClickStartMakeUp(){
				dialogFactory.showCriticalDialog('Are you sure you want to start ' + checkIsBhaOrBOP() + ' Make Up?', startMakeUp);
			}

			function onClickStartLayDown(){
				dialogFactory.showCriticalDialog('This action will start ' + checkIsBhaOrBOP() + ' Lay Down. Are you sure you want to do this?', startLayDown);
			}

			function onClickFinishMakeUp(){
				if (scope.operationData.bitDepthContext.bitDepth < scope.operationData.operationContext.currentOperation.length) {
					messageBitDepth(scope.operationData.operationContext.currentOperation.length);
				} else {
					dialogFactory.showCriticalDialog({ templateHtml: 'This action will set bit depth at <b>' + scope.operationData.operationContext.currentOperation.length + '</b>m. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Make Up?'}, finishMakeUp);
				}
			}

			function onClickFinishLayDown(){
				dialogFactory.showCriticalDialog('This action will end operation. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Lay Down?', finishLayDown);
			}

			function onClickStopCementation() {
				scope.actionButtonStopCementation();
			}

			function onClickFinishDurationAlarm(){
				dialogFactory.showConfirmDialog('This action will finish current duration alarm. Are you sure you want to do this?', scope.actionButtonFinishDurationAlarm);
			}

			function actionButtonStartCementation(currentBitDepth) {

				var operationEndBitDepth = scope.currentOperation.endBitDepth;

				if (operationEndBitDepth > currentBitDepth)
					dialogFactory.showCriticalDialog({templateHtml: '<p><b>Important !!!</b> The current bit depth is about <b>'+ currentBitDepth.toFixed(2) +'</b> Please make sure the entire casing string is bellow shoe depth due to start cemementing.</p>'}, startCementation);
				else
					startCementation();
			}

			function actionButtonStopCementation() {
				dialogFactory.showCriticalDialog('Are you sure you want to stop the Cementing Procedure? This action cannot be undone.', operationDataFactory.emitStopCementation);
			}

			function actionDisabledCementation() {
				messageBitDepth((scope.currentOperation.endBitDepth - scope.currentOperation.length));
			}

			function checkIsBhaOrBOP(){
				return (scope.operationData.operationContext.currentOperation.type == 'bha' ? 'BHA' : 'BOP');
			}

			function startCementation() {
				dialogFactory.showConfirmDialog('Are you sure you want to start the Cementing Procedure? This action cannot be undone.', operationDataFactory.emitStartCementation);
			}

			function startMakeUp() {
				dialogFactory.showConfirmDialog('Are you sure you want to start Make Up? This action cannot be undone.', scope.actionButtonStartMakeUp);
			}

			function startLayDown() {
				dialogFactory.showConfirmDialog('Are you sure you want to start Lay Down? This action cannot be undone.', scope.actionButtonStartLayDown);
			}

			function finishMakeUp() {
				dialogFactory.showConfirmDialog('Are you sure you want to finish Make Up? This action cannot be undone.', scope.actionButtonFinishMakeUp);
			}

			function finishLayDown() {
				dialogFactory.showConfirmDialog('Are you sure you want to finish Lay Down? This action cannot be undone.', scope.actionButtonFinishLayDown);
			}


			function actionButtonStartMakeUp(){
				operationDataFactory.emitStartMakeUp();
			}

			function actionButtonStartLayDown(){
				operationDataFactory.emitStartLayDown();
			}

			function actionButtonFinishMakeUp(){
				operationDataFactory.emitFinishMakeUp();
			}

			function actionButtonFinishLayDown(){
				operationDataFactory.emitFinishLayDown();
			}

			function actionButtonFinishDurationAlarm(){
				operationDataFactory.emitFinishDurationAlarm();
			}

			function messageBitDepth(acceptableBitDepth) {
				var bitDepthOrigin;

				if (scope.operationData.bitDepthContext.usingXpd) {
					bitDepthOrigin = 'XPD';
				} else {
					bitDepthOrigin = 'RIG';
				}

				dialogFactory.showMessageDialog(
					{ templateHtml: 'You are using <b>' + bitDepthOrigin + '</b> bit depth, and your current position is <b>' + scope.operationData.bitDepthContext.bitDepth + '</b>m,  please move the bit depth to <b>' + acceptableBitDepth + '</b>m to proceed.' },
				);
			}

			elem[0].className = elem[0].className + ' xpd-operation-manager-container';
		}
	}

})();