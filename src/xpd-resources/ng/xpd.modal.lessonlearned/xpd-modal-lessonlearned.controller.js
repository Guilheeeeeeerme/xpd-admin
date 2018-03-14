(function () {

	'use strict',

	angular.module('xpd.modal-lessonlearned').controller('modalLessonLearnedController', modalLessonLearnedController);

	modalLessonLearnedController.$inject = ['$scope', '$uibModalInstance', 'setupAPIService','selectedLessonLearned', 'insertCallback', 'updateCallback'];

	function modalLessonLearnedController($scope, $uibModalInstance, setupAPIService, selectedLessonLearned, insertCallback, updateCallback) {

		var vm = this;

		var roleList = {};

		$scope.selectedLessonLearned = angular.copy(selectedLessonLearned);

		$scope.lessonLearned = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Lessons Learned Categories'
		};


		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionClickSelectItem = actionClickSelectItem;

		getLessonLearnedCategoryList();

		function getLessonLearnedCategoryList() {
		    setupAPIService.getList(
		        'setup/lessonlearned_category',
		        function(response){
		        	getLessonLearnedCategoryListSuccessCallback(response.data);
		        },
		        getLessonLearnedCategoryListErrorCallback
		    );
		}

		function getLessonLearnedCategoryListSuccessCallback(result){
		    roleList = result;
		    makeTreeStructure(roleList);
		}

		function getLessonLearnedCategoryListErrorCallback(error) {
		    console.log(error);
		}

		function modalActionButtonSave() {
			var lessonLearned = $scope.selectedLessonLearned;

			if (!lessonLearned.id) {
				registerLessonLearned(lessonLearned);
			}else{
				updateLessonLearned(lessonLearned);
			}

		}

		function registerLessonLearned(lessonLearned) {
			insertCallback && insertCallback(lessonLearned);
			$uibModalInstance.close();
		}

		function updateLessonLearned(selectedLessonLearned) {
			updateCallback && updateCallback(selectedLessonLearned);
			$uibModalInstance.close();
		}

		function modalActionButtonClose() {
			$uibModalInstance.close();
		}

		function makeTreeStructure(data) {

		    var objList = data;
		    var lessonLearnedCategoryData = [];

		    for (var i in objList) {
		    	if ($scope.selectedLessonLearned.lessonLearnedCategory){
			        if ($scope.selectedLessonLearned.lessonLearnedCategory.id != null) {
	    				if ($scope.selectedLessonLearned.lessonLearnedCategory.id == objList[i].id) {
	    					objList[i].selected = true;
	    					$scope.lessonLearned.lastSelected = objList[i];
	    				}else{
	    					objList[i].selected = false;
	    				}
	    			}
	    		}else{
	    			objList[i].selected = false;
	    		}

		        objList[i].children = [];

		        var currentObj = objList[i];

		        // child to parent
		        if (currentObj.parentId == null || currentObj.parentId == undefined) {
		            lessonLearnedCategoryData.push(objList[i]);
		        }else{
		            objList[currentObj.parentId].children.push(currentObj);
		        }
		    }

		    $scope.selectedLessonLearned.roleList = lessonLearnedCategoryData;
		}

		function actionClickSelectItem(node) {
			makeBreadCrumbs(node);

			if ($scope.lessonLearned.lastSelected != null)
				$scope.lessonLearned.lastSelected.selected = false;

			$scope.lessonLearned.lastSelected = node;

			// reset
			$scope.selectedLessonLearned.lessonLearnedCategory = {};

			$scope.selectedLessonLearned.lessonLearnedCategory.id = node.id;

			node.selected = true;
		}

		function makeBreadCrumbs(node) {
			$scope.lessonLearned.breadcrumbs = 'Lessons Learned Categories';

			var objList = roleList;
			var parentNode = node.parentId;
			var breadcrumbs = node.initial+ ' - ' +node.name;

			for (var i in objList) {
				if (parentNode > 1) {
					breadcrumbs =  objList[parentNode].initial+ ' - ' +objList[parentNode].name + ' > ' + breadcrumbs;
				}else{
					$scope.lessonLearned.breadcrumbs += ' > ' + breadcrumbs;
					return;
				}
				parentNode = objList[parentNode].parentId;
			}
		}
	}
})();
