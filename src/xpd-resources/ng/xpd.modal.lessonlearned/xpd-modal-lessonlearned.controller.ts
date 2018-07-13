// (function() {

// 	'use strict',

// 	angular.module('xpd.modal-lessonlearned').controller('modalLessonLearnedController', modalLessonLearnedController);

// 	modalLessonLearnedController.$inject = ['$scope', '$uibModalInstance', 'lessonLearnedSetupAPIService', 'selectedLessonLearned', 'modalSuccessCallback', 'modalErrorCallback'];

// 	function modalLessonLearnedController($scope, $uibModalInstance, lessonLearnedSetupAPIService, selectedLessonLearned, modalSuccessCallback, modalErrorCallback) {
import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { LessonLearnedSetupAPIService } from '../xpd.setupapi/lessonlearned-setupapi.service';

export class ModalLessonLearnedController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'lessonLearnedSetupAPIService',
		'selectedLessonLearned',
		'modalSuccessCallback',
		'modalErrorCallback'];

	public modalActionButtonSave: () => void;
	public modalActionButtonClose: () => void;
	public actionClickSelectItem: (node: any) => void;

	constructor(
		$scope: any,
		$uibModalInstance: IModalServiceInstance,
		lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		selectedLessonLearned: any,
		modalSuccessCallback: any,
		modalErrorCallback: any) {

		const vm = this;

		let roleList = {};

		$scope.selectedLessonLearned = angular.copy(selectedLessonLearned);

		$scope.lessonLearned = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Lessons Learned Categories',
		};

		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionClickSelectItem = actionClickSelectItem;

		getLessonLearnedCategoryList();

		function getLessonLearnedCategoryList() {
			lessonLearnedSetupAPIService.getListCategory(
				getLessonLearnedCategoryListSuccessCallback,
				getLessonLearnedCategoryListErrorCallback,
			);
		}

		function getLessonLearnedCategoryListSuccessCallback(result) {
			roleList = result;
			makeTreeStructure(roleList);
		}

		function getLessonLearnedCategoryListErrorCallback(error) {
			console.log(error);
		}

		function modalActionButtonSave() {
			const lessonLearned = $scope.selectedLessonLearned;

			if (!lessonLearned.id) {
				registerLessonLearned(lessonLearned);
			} else {
				updateLessonLearned(lessonLearned);
			}

		}

		function registerLessonLearned(lessonLearned) {
			lessonLearnedSetupAPIService.insertObject(
				lessonLearned,
				lessonLearnedSuccessCallback,
				lessonLearnedErrorCallback,
			);
		}

		function updateLessonLearned(lessonLearned) {
			lessonLearnedSetupAPIService.updateObject(
				lessonLearned,
				lessonLearnedSuccessCallback,
				lessonLearnedErrorCallback,
			);
		}

		function lessonLearnedSuccessCallback(result) {
			$uibModalInstance.close();
			modalSuccessCallback(result);
		}

		function lessonLearnedErrorCallback(error) {
			modalErrorCallback();
		}

		function modalActionButtonClose() {
			$uibModalInstance.close();
		}

		function makeTreeStructure(data) {

			const objList = data;
			const lessonLearnedCategoryData = [];

			for (const i in objList) {
				if ($scope.selectedLessonLearned.lessonLearnedCategory) {
					if ($scope.selectedLessonLearned.lessonLearnedCategory.id != null) {
						if ($scope.selectedLessonLearned.lessonLearnedCategory.id === objList[i].id) {
							objList[i].selected = true;
							$scope.lessonLearned.lastSelected = objList[i];
						} else {
							objList[i].selected = false;
						}
					}
				} else {
					objList[i].selected = false;
				}

				objList[i].children = [];

				const currentObj = objList[i];

				// child to parent
				if (currentObj.parentId == null || currentObj.parentId === undefined) {
					lessonLearnedCategoryData.push(objList[i]);
				} else {
					objList[currentObj.parentId].children.push(currentObj);
				}
			}

			$scope.selectedLessonLearned.roleList = lessonLearnedCategoryData;
		}

		function actionClickSelectItem(node) {
			makeBreadCrumbs(node);

			if ($scope.lessonLearned.lastSelected != null) {
				$scope.lessonLearned.lastSelected.selected = false;
			}

			$scope.lessonLearned.lastSelected = node;

			// reset
			$scope.selectedLessonLearned.lessonLearnedCategory = {};

			$scope.selectedLessonLearned.lessonLearnedCategory.id = node.id;

			node.selected = true;
		}

		function makeBreadCrumbs(node) {
			$scope.lessonLearned.breadcrumbs = 'Lessons Learned Categories';

			const objList = roleList;
			let parentNode = node.parentId;
			let breadcrumbs = node.initial + ' - ' + node.name;

			for (const i in objList) {
				if (parentNode > 1) {
					breadcrumbs = objList[parentNode].initial + ' - ' + objList[parentNode].name + ' > ' + breadcrumbs;
				} else {
					$scope.lessonLearned.breadcrumbs += ' > ' + breadcrumbs;
					return;
				}
				parentNode = objList[parentNode].parentId;
			}
		}
	}

}
