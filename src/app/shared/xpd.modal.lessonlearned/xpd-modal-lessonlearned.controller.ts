// (function() {

// 	'use strict',

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

	public roleList: any;

	constructor(
		private $scope: any,
		private $uibModalInstance: IModalServiceInstance,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService,
		private selectedLessonLearned: any,
		private modalSuccessCallback: any,
		private modalErrorCallback: any) {

		const vm = this;

		this.roleList = {};

		$scope.selectedLessonLearned = angular.copy(selectedLessonLearned);

		$scope.lessonLearned = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Lessons Learned Categories',
		};

		this.getLessonLearnedCategoryList();

	}

	public modalActionButtonSave() {
		const lessonLearned = this.$scope.selectedLessonLearned;

		if (!lessonLearned.id) {
			this.registerLessonLearned(lessonLearned);
		} else {
			this.updateLessonLearned(lessonLearned);
		}

	}

	public modalActionButtonClose() {
		this.$uibModalInstance.close();
	}

	public actionClickSelectItem(node) {
		this.makeBreadCrumbs(node);

		if (this.$scope.lessonLearned.lastSelected != null) {
			this.$scope.lessonLearned.lastSelected.selected = false;
		}

		this.$scope.lessonLearned.lastSelected = node;

		// reset
		this.$scope.selectedLessonLearned.lessonLearnedCategory = {};

		this.$scope.selectedLessonLearned.lessonLearnedCategory.id = node.id;

		node.selected = true;
	}

	private getLessonLearnedCategoryList() {
		this.lessonLearnedSetupAPIService.getListCategory().then(
			(arg) => { this.getLessonLearnedCategoryListSuccessCallback(arg); },
			(arg) => { this.getLessonLearnedCategoryListErrorCallback(arg); },
		);
	}

	private getLessonLearnedCategoryListSuccessCallback(result) {
		this.roleList = result;
		this.makeTreeStructure(this.roleList);
	}

	private getLessonLearnedCategoryListErrorCallback(error) {
		console.log(error);
	}

	private registerLessonLearned(lessonLearned) {
		this.lessonLearnedSetupAPIService.insertObject(
			lessonLearned).then(
				(arg) => { this.lessonLearnedSuccessCallback(arg); },
				(arg) => { this.lessonLearnedErrorCallback(arg); },
		);
	}

	private updateLessonLearned(lessonLearned) {
		this.lessonLearnedSetupAPIService.updateObject(
			lessonLearned).then(
				(arg) => { this.lessonLearnedSuccessCallback(arg); },
				(arg) => { this.lessonLearnedErrorCallback(arg); },
		);
	}

	private lessonLearnedSuccessCallback(result) {
		this.$uibModalInstance.close();
		this.modalSuccessCallback(result);
	}

	private lessonLearnedErrorCallback(error) {
		this.modalErrorCallback();
	}

	private makeTreeStructure(data) {

		const objList = data;
		const lessonLearnedCategoryData = [];

		for (const i in objList) {
			if (this.$scope.selectedLessonLearned.lessonLearnedCategory) {
				if (this.$scope.selectedLessonLearned.lessonLearnedCategory.id != null) {
					if (this.$scope.selectedLessonLearned.lessonLearnedCategory.id === objList[i].id) {
						objList[i].selected = true;
						this.$scope.lessonLearned.lastSelected = objList[i];
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

		this.$scope.selectedLessonLearned.roleList = lessonLearnedCategoryData;
	}

	private makeBreadCrumbs(node) {
		this.$scope.lessonLearned.breadcrumbs = 'Lessons Learned Categories';

		const objList = this.roleList;
		let parentNode = node.parentId;
		let breadcrumbs = node.initial + ' - ' + node.name;

		for (const i in objList) {
			if (parentNode > 1) {
				breadcrumbs = objList[parentNode].initial + ' - ' + objList[parentNode].name + ' > ' + breadcrumbs;
			} else {
				this.$scope.lessonLearned.breadcrumbs += ' > ' + breadcrumbs;
				return;
			}
			parentNode = objList[parentNode].parentId;
		}
	}

}
