(function () {

	'use strict',

	angular.module('xpd.modal-failure').controller('modalFailureController', modalFailureController);

	modalFailureController.$inject = ['$scope', '$uibModalInstance', 'setupAPIService', 'failureSetupAPIService', 'selectedFailure', 'insertCallback', 'updateCallback', 'dialogFactory', 'operationDataFactory'];

	function modalFailureController($scope, $uibModalInstance, setupAPIService, failureSetupAPIService, selectedFailure, insertCallback, updateCallback, dialogFactory, operationDataFactory) {
		var vm = this;

		var roleList = {};

		$scope.selectedFailure = angular.copy(selectedFailure);

		$scope.toMilli = toMilli;
		$scope.now = now;
		$scope.keepTimeBeforeNow = keepTimeBeforeNow;


		operationDataFactory.operationData = [];

		$scope.category = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Failure / Delay categories'
		};

		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionOnGoingCheckboxClick = actionOnGoingCheckboxClick;
		vm.actionClickSelectItem = actionClickSelectItem;

		getCategoryList();

		getFailuresOnGoing();

		function getCategoryList() {
			setupAPIService.getList(
				'setup/category',
				function (response) {
					getCategoryListSuccessCallback(response.data);
				}
			);
		}

		function toMilli(param) {
			var date = new Date(param);
			return date.getTime();
		}

		function now() {
			var now = new Date();
			now.setSeconds(0);
			now.setMilliseconds(0);
			return now;
		}

		function keepTimeBeforeNow() {
			var currentTime = now();

			if ($scope.selectedFailure.endTime && toMilli($scope.selectedFailure.endTime) > currentTime.getTime()) {
				$scope.selectedFailure.endTime = currentTime;
			}
		}


		function getFailuresOnGoing() {

			failureSetupAPIService.listFailuresOnGoing(function (response) {
				if (response.length == 0)
					$scope.selectedFailure.onGoingFlag = true;
				else
					$scope.selectedFailure.onGoingFlag = false;
			});
		}

		function getCategoryListSuccessCallback(result) {
			roleList = result;
			makeTreeStructure(roleList);
		}

		function getCategoryListErrorCallback(error) {
			console.log(error);
		}

		function modalActionButtonSave() {
			var failure = $scope.selectedFailure;

			if (failure.onGoing) {

				operationDataFactory.emitStartFailureOnGoing(failure);

				operationDataFactory.addEventListener('modalFailureController', 'setOnGoingFailureListener', insertFailureSuccessCallback);

				operationDataFactory.addEventListener('modalFailureController', 'setOnErrorInsertFailureListener', insertFailureErrorCallback);

			} else {
				if (!failure.id) {
					registerFailure(failure);
				} else {
					updateFailure(failure);
				}
			}

		}

		function registerFailure(failure) {
			setupAPIService.insertObject(
				'setup/failure',
				failure,
				failureSuccessCallback,
				failureErrorCallback
			);
		}

		function updateFailure(failure) {
			setupAPIService.updateObject(
				'setup/failure',
				failure,
				failureSuccessCallback,
				failureErrorCallback
			);
		}

		function failureSuccessCallback(result) {
			$uibModalInstance.close();
		}

		function failureErrorCallback(error) {
			/*console.log('NPT error!');*/
			dialogFactory.showConfirmDialog('NPT already exists in this time interval!');
		}

		function modalActionButtonClose() {
			$uibModalInstance.close();
		}

		function actionOnGoingCheckboxClick(value) {
			$scope.selectedFailure.onGoing = value;

			if (value) {
				$scope.selectedFailure.endTime = null;
			}
		}

		function makeTreeStructure(data) {

			var objList = data;
			var categoryData = [];

			for (var i in objList) {
				if ($scope.selectedFailure.category) {

					if ($scope.selectedFailure.category.id != null) {
						if ($scope.selectedFailure.category.id == objList[i].id) {
							objList[i].selected = true;
							$scope.category.lastSelected = objList[i];
						} else {
							objList[i].selected = false;
						}
					}
				} else {
					objList[i].selected = false;
				}

				objList[i].children = [];

				var currentObj = objList[i];

				// child to parent
				if (currentObj.parentId == null || currentObj.parentId == undefined) {
					categoryData.push(objList[i]);
				} else {
					objList[currentObj.parentId].children.push(currentObj);
				}
			}

			$scope.category.roleList = categoryData;
		}

		function actionClickSelectItem(node) {
			makeBreadCrumbs(node);

			if ($scope.category.lastSelected != null)
				$scope.category.lastSelected.selected = false;

			$scope.category.lastSelected = node;

			// reset
			$scope.selectedFailure.category = {};

			$scope.selectedFailure.category.id = node.id;

			node.selected = true;
		}

		function makeBreadCrumbs(node) {
			$scope.category.breadcrumbs = 'Failure / Delay categories';

			var objList = roleList;
			var parentNode = node.parentId;
			var breadcrumbs = node.initial + ' - ' + node.name;

			for (var i in objList) {
				if (parentNode > 1) {
					breadcrumbs = objList[parentNode].initial + ' - ' + objList[parentNode].name + ' > ' + breadcrumbs;
				} else {
					$scope.category.breadcrumbs += ' > ' + breadcrumbs;
					return;
				}
				parentNode = objList[parentNode].parentId;
			}
		}

	}
})();
