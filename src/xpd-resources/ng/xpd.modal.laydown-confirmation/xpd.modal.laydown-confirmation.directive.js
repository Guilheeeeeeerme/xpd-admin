(function () {

	'use strict';

	var app = angular.module('xpd.modal.laydown-confirmation',[]);

	app.directive('laydownConfirmation', laydownConfirmation);

	laydownConfirmation.$inject = ['$uibModal', 'operationDataFactory'];

	function laydownConfirmation($uibModal, operationDataFactory) {

		return {
			scope:{
				dismissable: '<'
			},
			link: link
		};

		function link(scope, element, $attrs){

			var self = this;

			var layDownDetectedModal = null;

			scope.actionButtonStartLaydown = actionButtonStartLaydown;
			
			operationDataFactory.openConnection([]).then(function (response) {
				operationDataFactory = response;
			});

			operationDataFactory.addEventListener('trackingController', 'setOnStateChangeListener', checkCurrentState);
			operationDataFactory.addEventListener('trackingController', 'setOnCurrentStateListener', checkCurrentState);
			operationDataFactory.addEventListener('trackingController', 'setOnChangeLaydownStatusListener', checkCurrentState);

			function actionButtonStartLaydown(){
				operationDataFactory.emitStartLayDown();
			}

			function checkCurrentState (stateContext){

				// console.log(stateContext.currentState, stateContext.layDownDetected);

				if(!layDownDetectedModal && stateContext.currentState == 'layDown' && stateContext.layDownDetected == true){
					scope.buttonNameStartLayDown = 'Start ' + (operationDataFactory.operationData.operationContext.currentOperation.type == 'bha' ? 'BHA' : 'BOP') + ' Lay Down';

					layDownDetectedModal = $uibModal.open({
						keyboard: false,
						backdrop: 'static',
						animation: false,
						scope: scope,
						size: 'lg',
						backdrop: !!scope.dismissable,
						windowClass: 'laydown-confirmation-modal',
						templateUrl: '../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.template.html'
					});

				}else if(layDownDetectedModal){
					layDownDetectedModal.close && layDownDetectedModal.close();
					layDownDetectedModal = null;
				}


			}

		}
	}

})();
