(function () {
	'use strict';

	angular.module('xpd.operationmanager', []).directive('xpdOperationManager', xpdOperationManager);

	xpdOperationManager.$inject = ['$uibModal', 'dialogFactory'];

	function xpdOperationManager($uibModal, dialogFactory) {

		return {
			scope: {
				'currentOperation': '=',
				'operationQueue': '=',
				'lastSection': '=',
				'currentState': '=',
				'currentEvent': '=',
				'currentDirection': '=',
				'currentBitDepth': '=',
				'popoverPlacement': '@',
				'actionButtonStartOperation': '=',
				'actionButtonFinishOperation': '=',
				'actionButtonStartCementation': '=',
				'actionButtonStopCementation': '=',
				'actionButtonStartMakeUp': '=',
				'actionButtonStartLayDown': '=',
				'actionButtonFinishMakeUp': '=',
				'actionButtonFinishLayDown': '=',
			},
			restrict: 'EA',
			link: link,
			templateUrl: '../xpd-resources/ng/xpd.operationmanager/operationmanager.template.html'
		};

		function link(scope, elem, attrs) {

			scope.stacked = (attrs.display == 'stacked');

			scope.clickStartOperation = clickStartOperation;
			scope.closeModal = closeModal;
			scope.onClickOK = onClickOK;

			scope.onClickStartMakeUp = onClickStartMakeUp;
			scope.onClickStartLayDown = onClickStartLayDown;
			scope.onClickFinishMakeUp = onClickFinishMakeUp;
			scope.onClickFinishLayDown = onClickFinishLayDown;


			var modalBitDepth;

			if(!attrs.view || attrs.view != 'driller')
				scope.drillerView = false;
			else
				scope.drillerView = true;

			function clickStartOperation(){

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

			function closeModal(){
				modalBitDepth.close();
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
				dialogFactory.showCriticalDialog({templateHtml: 'This action will set bit depth at <b>' + scope.currentOperation.length + '</b>m. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Make Up?'}, finishMakeUp);
			}

			function onClickFinishLayDown(){
				dialogFactory.showCriticalDialog({templateHtml: 'This action will end operation. Are you sure you want to finish ' + checkIsBhaOrBOP() + ' Lay Down?'}, finishLayDown);
			}

			function checkIsBhaOrBOP(){
				return (scope.currentOperation.type == 'bha' ? 'BHA' : 'BOP');
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

    		scope.operationQueuePopover = {
    			templateUrl: 'operationQueueTemplate.html',
    			title: 'Operation Queue'
    		};

			elem[0].className = elem[0].className + ' xpd-operation-manager-container';
		}
	}

})();
