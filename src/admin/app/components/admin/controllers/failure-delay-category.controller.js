(function () {
	'use strict';

	angular.module('xpd.admin')
		.controller('FailureDelayCategoryController', failureDelayCategoryController);

	failureDelayCategoryController.$inject = ['$scope', '$uibModal', 'dialogFactory', 'categorySetupAPIService'];

	function failureDelayCategoryController($scope, $modal, dialogFactory, categorySetupAPIService){
		var vm = this;

		$scope.controller = vm;

		$scope.category = {
			roleList: [],
			lastSelected: null
		};

		$scope.newNode = {};

		//temporary node
	    $scope.temporaryNode = {
	        children: []
	    };

	  	var roleList = {};

		vm.actionClickAdd = actionClickAdd;
		vm.actionClickEdit = actionClickEdit;
		vm.actionClickRemove = actionClickRemove;
		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionClickSelectItem = actionClickSelectItem;
		vm.hasChildren = hasChildren;

		getCategoryList();

		function getCategoryList() {
			categorySetupAPIService.getList(
				getCategoryListSuccessCallback,
				getCategoryListErrorCallback
			);
		}

		function getCategoryListSuccessCallback(result){
			roleList = result;
			makeTreeStructure(roleList);
		}

		function getCategoryListErrorCallback(error) {
			console.log(error);
		}

		function actionClickAdd(parentNode) {
			// reset
		  	$scope.newNode = {};

			$scope.newNode.parentId = parentNode.id;

			$scope.$modalInstance = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/upsert-category.modal.html',
				scope: $scope
			});

		}

		function actionClickEdit(node) {

			$scope.newNode = angular.copy(node);
			delete $scope.newNode.children;

			$scope.$modalInstance = $modal.open({
				animation: true,
				keyboard: false,
				backdrop: 'static',
				size: 'modal-sm',
				templateUrl: 'app/components/admin/views/modal/upsert-category.modal.html',
				scope: $scope
			});
		}

		function actionClickRemove(node) {

			dialogFactory.showConfirmDialog('Do you want to remove this category?',
				function () {
					removeNode(node);
				}
			);
		}

		function modalActionButtonSave() {
			if (!$scope.newNode.id){
				saveNode($scope.newNode);
			}else{
				updateNode($scope.newNode);
			}
		}

		function modalActionButtonClose() {
			$scope.$modalInstance.close();
		}


		function saveNode(node) {
			categorySetupAPIService.insertObject(
				node,
				saveNodeSuccessCallback,
				upsertNodeErrorCallback
			);
		}

		function saveNodeSuccessCallback(result) {
			
			result.children = [];
		  	roleList[result.id] = result;
		  	roleList[result.parentId].children.push(result);

		  	$scope.$modalInstance.close();
		  	$scope.newNode = {};
		}

		function updateNode(node) {
			categorySetupAPIService.updateObject(
				node,
				updateNodeSuccessCallback,
				upsertNodeErrorCallback
			);
		}

		function updateNodeSuccessCallback(result) {
			
			roleList[result.id].name = result.name;
			roleList[result.id].initial = result.initial;

			$scope.$modalInstance.close();
		  	$scope.newNode = {};
		}

		function upsertNodeErrorCallback(error) {
			dialogFactory.showConfirmDialog(error.message);
		}

		function removeNode(node) {
			categorySetupAPIService.removeObject(
				node,
				removeNodeSuccessCallback,
				removeNodeErrorCallback
			);
		}

		function removeNodeSuccessCallback(result) {

			var parentChildren = roleList[result.parentId].children;

			//remome o filho que esta no array do pai
			for(var i in parentChildren){
				if (result.id == parentChildren[i].id){
					parentChildren.splice(i, 1);
				}
			}
			delete roleList[result.id];
		}

		function removeNodeErrorCallback(error) {
			dialogFactory.showConfirmDialog(error.message);
		}

		function actionClickSelectItem(node) {
			if ($scope.category.lastSelected != null)
				$scope.category.lastSelected.selected = false;

			$scope.category.lastSelected = node;

			node.selected = true;
		}

		function makeTreeStructure(data) {

			var objList = data;
			var categoryData = [];

			for (var i in objList) {

				objList[i].children = [];
				objList[i].selected = false;

				var currentObj = objList[i];

				// child to parent
				if (currentObj.parentId == null || currentObj.parentId == undefined) {
					categoryData.push(objList[i]);
				}else{
					objList[currentObj.parentId].children.push(currentObj);
				}
			}

			$scope.category.roleList = categoryData;
		}

		function hasChildren(node) {
			var children = node.children;

			if (children.length > 0) {
				return true;
			}

			return false;
		}
	}
})();
