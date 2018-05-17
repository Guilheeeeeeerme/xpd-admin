/*
* @Author: gustavogomides7
* @Date:   2017-06-12 09:47:31
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-10-05 16:42:35
*/

(function (){
	'use strict';

	angular.module('xpd.failure-controller')
		.directive('failureNavBar', failureNavBar);

	failureNavBar.$inject = ['$location', '$uibModal', 'categorySetupAPIService', 'operationDataFactory', 'dialogFactory'];

	function failureNavBar($location, $uibModal, categorySetupAPIService, operationDataFactory, dialogFactory) {
		return {
			scope: {

			},
			restrict: 'EA',
			templateUrl: '../xpd-resources/ng/xpd.failure-controller/failure-nav-bar.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			operationDataFactory.operationData = [];

			operationDataFactory.addEventListener('failureNavBar', 'setOnGoingFailureListener', loadOnGoingFailure);

			scope.actionButtonOpenFailureLessonModal = actionButtonOpenFailureLessonModal;
			scope.actionButtonFinishFailureOnGoing = actionButtonFinishFailureOnGoing;
			
			loadOnGoingFailure();

			function loadOnGoingFailure() {
				
				if (operationDataFactory.operationData.onGoingFailureContext.onGoingFailure != null
					&& operationDataFactory.operationData.onGoingFailureContext.onGoingFailure.length != 0) {
					
					scope.onGoingFailure = operationDataFactory.operationData.onGoingFailureContext.onGoingFailure;
					
					if (scope.onGoingFailure.npt){
						scope.failureClass = 'failure-npt';
						scope.categoryClass = 'failure-npt-category';
					} else{
						scope.failureClass = 'failure-normal';
						scope.categoryClass = 'failure-normal-category';
					}

					scope.enableFinishFailure = true;

					categorySetupAPIService.getCategoryName(scope.onGoingFailure.category.id, getCategoryNameSuccessCallback);
					
				} else {
					scope.failureClass = '';
					scope.failureTitle = 'No Failure on Going';
					scope.enableFinishFailure = false;
				}
			}

			function getCategoryNameSuccessCallback(data){
				scope.failureTitle = 'Failure on Going';
				scope.failureCategory = data.name;
			}

			function actionButtonOpenFailureLessonModal(){
				$uibModal.open({
					animation: true,
					keyboard: false,
					backdrop: 'static',
					size: 'modal-sm',
					windowClass: 'xpd-operation-modal',
					templateUrl: 'app/components/admin/views/modal/tabs-failure-lesson.modal.html',
					controller: 'TabsCtrl as tbsController'
				});
			}

			function actionButtonFinishFailureOnGoing() {
				dialogFactory.showCriticalDialog('Are you sure you want to finish Failure?', finishFailureOnGoing);
			}

			function finishFailureOnGoing(){
				scope.failureClass = '';
				scope.failureTitle = 'No Failure on Going';
				scope.enableFinishFailure = false;

				scope.onGoingFailure.onGoing = false;
				
				operationDataFactory.emitFinishFailureOnGoing();
			}
			
		}
	}

})();