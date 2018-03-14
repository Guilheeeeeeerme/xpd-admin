(function () {
	'use strict';

	angular.module('xpd.admin').controller('WellController', wellController);

	wellController.$inject = ['$scope', '$uibModal', 'setupAPIService', 'wellSetupAPIService', 'dialogFactory', 'operationDataFactory'];

	function wellController($scope, $modal, setupAPIService, wellSetupAPIService, dialogFactory, operationDataFactory) {

		var vm = this;

		$scope.dados = {
			wellList: []
		};
		
		operationDataFactory.operationData = [];

		operationDataFactory.operationData = [];
		$scope.operationData = operationDataFactory.operationData;

		vm.actionButtonAddWell = actionButtonAddWell;
		vm.actionButtonEditWell = actionButtonEditWell;
		vm.actionButtonRemoveWell = actionButtonRemoveWell;

		vm.actionButtonMakeCurrent = actionButtonMakeCurrent;
		vm.actionButtonMakeNotCurrent = actionButtonMakeNotCurrent;

		operationDataFactory.addEventListener('wellController', 'setOnCurrentWellListener', loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnNoCurrentWellListener', loadWellList);
		operationDataFactory.addEventListener('wellController', 'setOnWellChangeListener', loadWellList);

		loadWellList();

		function loadWellList() {
			delete $scope.dados.wellList;

			setupAPIService.getList('setup/well', function (wellList) {
				$scope.dados.wellList = wellList.data;
			});
		}

		function actionButtonEditWell(well) {
			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
				controller: 'WellUpsertController as wuController',
				resolve: {
					callback: function () {
						return upsertCallback;
					},
					initialData: function () {
						return well;
					}
				}
			});
		}

		function actionButtonAddWell() {
			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/well-upsert.modal.html',
				controller: 'WellUpsertController as wuController',
				resolve: {
					callback: function () {
						return upsertCallback;
					},
					initialData: function () {
						return {};
					}
				}
			});
		}

		function actionButtonRemoveWell(well) {

			wellSetupAPIService.getListOfSectionsByWell(well.id, function (sectionList) {
				if(sectionList.length == 0)
					removeWell(well);
				else
					dialogFactory.showMessageDialog('You can\'t delete a Well with Sections and Operations inside.', 'Unable to Remove Well');
			});
		}

		function actionButtonMakeCurrent(well) {

			if ($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running) {
				dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
			} else {
				operationDataFactory.emitMakeCurrentWell(well);
			}
		}

		function actionButtonMakeNotCurrent(well) {

			if ($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running) {
				dialogFactory.showMessageDialog('Unable to change Well due to Running Operation.', 'Error');
			} else {
				operationDataFactory.emitInterruptCurrentWell(well);
			}
		}

		function upsertCallback(well) {

			if (well.id != null) {
				setupAPIService.updateObject('setup/well', well, loadWellList);
			} else {
				setupAPIService.insertObject('setup/well', well, loadWellList);
			}
		}

		function removeWell(well) {
			dialogFactory.showCriticalDialog({ templateHtml: 'By <b>removing</b> a Well you will no longer be able to access its sections. Proceed?' },
				function () {
					setupAPIService.removeObject('setup/well', well, loadWellList);
				});
		}

	}

})();
