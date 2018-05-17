(function () {
	'use strict';

	angular.module('xpd.admin').controller('SectionController', sectionController);

	sectionController.$inject = ['$scope', '$filter', '$localStorage', '$location', '$uibModal', '$routeParams', 'sectionSetupAPIService', 'dialogFactory', 'wellSetupAPIService', 'operationDataFactory'];

	function sectionController($scope, $filter, $localStorage, $location, $modal, $routeParams, sectionSetupAPIService, dialogFactory, wellSetupAPIService, operationDataFactory) {

		var vm = this;

		$routeParams.wellId = +$routeParams.wellId;

		$scope.dados = {
			sectionList: [],
		};

		wellSetupAPIService.getObjectById($routeParams.wellId, function(well){
			$scope.well = well;
		});
		
		if(!$localStorage.setup){
			$localStorage.setup = {};
		}
		
		if(!$localStorage.setup.openedSections){
			$localStorage.setup.openedSections = {};
		}

		$scope.openedSections = $localStorage.setup.openedSections;

		$scope.$watch('openedSections', function(openedSections){
			if(openedSections){
				for(var i in openedSections){
					$localStorage.setup.openedSections[i] = openedSections[i];
				}
			}
		}, true);
		
		operationDataFactory.operationData = [];
		$scope.operationData = operationDataFactory.operationData;

		vm.actionButtonAddSection = actionButtonAddSection;
		vm.actionButtonEditSection = actionButtonEditSection;
		vm.actionButtonRemoveSection = actionButtonRemoveSection;

		vm.actionButtonAddOperation = actionButtonAddOperation;
		vm.actionButtonEditOperation = actionButtonEditOperation;
		vm.actionButtonRemoveOperation = actionButtonRemoveOperation;

		vm.swapSection = swapSection;
		vm.swapOperation = swapOperation;

		vm.actionButtonMakeCurrent = actionButtonMakeCurrent;

		operationDataFactory.addEventListener('sectionController', 'setOnOperationQueueChangeListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnCurrentOperationQueueListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnNoCurrentOperationQueueListener', loadSectionList);
		operationDataFactory.addEventListener('sectionController', 'setOnUnableToMakeCurrentListener', unableToMakeCurrent);

		loadSectionList();

		function actionButtonMakeCurrent(operation) {
			if($scope.operationData.operationContext.currentOperation && $scope.operationData.operationContext.currentOperation.running){
				dialogFactory.showMessageDialog('Unable to make operation #' + operation.id + ', ' + operation.name + ' current due to running operation', 'Error');
			}else{
				operationDataFactory.emitMakeCurrentOperation(operation);
			}
		}

		function swapSection(section1, section2) {
			operationDataFactory.emitUpdateSectionOrder([section1, section2]);
		}

		function swapOperation(operation1, operation2) {
			operationDataFactory.emitUpdateOperationOrder([operation1, operation2]);
		}

		function loadSectionList() {

			$scope.dados.sectionList = [];

			if ($routeParams.wellId != null) {
				sectionSetupAPIService.getListOfSectionsByWell($routeParams.wellId, function (sectionList) {
					$scope.dados.sectionList = $filter('orderBy')(sectionList, 'sectionOrder');
				});
			}

		}

		function actionButtonAddSection() {

			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'md',
				templateUrl: 'app/components/admin/views/modal/section-upsert.modal.html',
				controller: 'SectionUpsertController as suController',
				resolve: {
					callback: function () {
						return modalUpsertCallback;
					},
					initialData: function () {
						return {
							well: $scope.well
						};
					}
				}
			});
		}

		function actionButtonEditSection(section) {

			section.well = $scope.well;

			$modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'md',
				templateUrl: 'app/components/admin/views/modal/section-upsert.modal.html',
				controller: 'SectionUpsertController as suController',
				resolve: {
					callback: function () {
						return modalUpsertCallback;
					},
					initialData: function () {
						return section;
					}
				}
			});
		}

		function actionButtonRemoveSection(section) {

			dialogFactory.showCriticalDialog({templateHtml:'By <b>removing</b> a Section you will no longer be able to access its operations. Proceed?'}, function () {
				operationDataFactory.emitRemoveSection(section);
			});

		}

		function modalUpsertCallback(section) {

			section.well = {
				id: $routeParams.wellId
			};

			delete section.operations;

			if (section.id != null) {
				sectionSetupAPIService.updateObject( 
				section, replaceOnList);
			} else {
				section.sectionOrder = $scope.dados.sectionList.length + 1;

				sectionSetupAPIService.insertObject(
					section,
					operationDataFactory.emitRefreshQueue);
			}
		}

		function replaceOnList(updatedSection) {

			for (var i in $scope.dados.sectionList) {
				var section = $scope.dados.sectionList[i];

				if (section.id == updatedSection.id) {
					$scope.dados.sectionList[i] = updatedSection;
					break;
				}
			}
		}

		/********************************************************/
		/********************************************************/
		/********************************************************/

		function actionButtonAddOperation(type, section) {

			$location.path('/setup/well/'+$routeParams.wellId+'/section/'+section.id+'/operation/').search({
				operation: JSON.stringify({
					id: null,
					type: type,
					section: section
				}),
			});
		}

		function actionButtonEditOperation(section, operation) {

			operation.section = section;
			delete operation.section.operations;

			$location.path('/setup/well/'+$routeParams.wellId+'/section/'+section.id+'/operation/').search({
				operation: JSON.stringify({
					id: operation.id,
					type: operation.type,
					section: section
				})
			});

		}

		function actionButtonRemoveOperation(operation) {
			dialogFactory.showCriticalDialog({templateHtml:'By <b>removing</b> a Operation you will not be able to start it and all the data will be lost. Proceed?'}, function(){
				operationDataFactory.emitRemoveOperation(operation);
			});
		}
	
		function unableToMakeCurrent(operation) {
			dialogFactory.showMessageDialog('Unable to make operation #' + operation.nextOperation.name + ' current', 'Error');
		}
	}


})();
