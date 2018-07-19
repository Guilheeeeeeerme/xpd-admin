import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';
import upsertCategoryTemplate from './upsert-category.modal.html';
/*
* @Author: gustavogomides7
* @Date:   2017-02-24 16:27:37
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 11:31:26
*/
export class LessonLearnedCategoryController {
	// 'use strict';

	// 	.controller('LessonLearnedCategoryController', lessonLearnedCategoryController);

	public static $inject = ['$scope', '$uibModal', 'dialogService', 'lessonLearnedSetupAPIService'];
	public roleList: {};

	constructor(
		private $scope: any,
		private $modal: IModalService,
		private dialogService: DialogService,
		private lessonLearnedSetupAPIService: LessonLearnedSetupAPIService) {

		const vm = this;

		$scope.controller = vm;

		$scope.category = {
			roleList: [],
			lastSelected: null,
		};

		$scope.newNode = {};

		// temporary node
		$scope.temporaryNode = {
			children: [],
		};

		this.roleList = {};

		this.getLessonLearnedCategoryList();
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

	public actionClickAdd(parentNode) {
		// reset
		this.$scope.newNode = {};

		this.$scope.newNode.parentId = parentNode.id;

		this.$scope.$modalInstance = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: upsertCategoryTemplate,
			scope: this.$scope,
		});

	}

	public actionClickEdit(node) {

		this.$scope.newNode = angular.copy(node);
		delete this.$scope.newNode.children;

		this.$scope.$modalInstance = this.$modal.open({
			animation: true,
			keyboard: false,
			backdrop: 'static',
			size: 'modal-sm',
			template: upsertCategoryTemplate,
			scope: this.$scope,
		});
	}

	public actionClickRemove(node) {

		this.dialogService.showConfirmDialog('Do you want to remove this category?',
			() => {
				this.removeNode(node);
			},
		);
	}

	public modalActionButtonSave() {
		if (!this.$scope.newNode.id) {
			this.saveNode(this.$scope.newNode);
		} else {
			this.updateNode(this.$scope.newNode);
		}
	}

	public modalActionButtonClose() {
		this.$scope.$modalInstance.close();
	}

	private saveNode(node) {
		this.lessonLearnedSetupAPIService.insertCategory(
			node).then(
				(arg) => { this.saveNodeSuccessCallback(arg); },
				(arg) => { this.upsertNodeErrorCallback(arg); },
		);
	}

	private saveNodeSuccessCallback(result) {

		result.children = [];
		this.roleList[result.id] = result;
		this.roleList[result.parentId].children.push(result);

		this.$scope.$modalInstance.close();
		this.$scope.newNode = {};
	}

	private updateNode(node) {
		this.lessonLearnedSetupAPIService.updateCategory(node).then(
			(arg) => { this.updateNodeSuccessCallback(arg); },
			(arg) => { this.upsertNodeErrorCallback(arg); },
		);
	}

	private updateNodeSuccessCallback(result) {

		this.roleList[result.id].name = result.name;
		this.roleList[result.id].initial = result.initial;

		this.$scope.$modalInstance.close();
		this.$scope.newNode = {};
	}

	private upsertNodeErrorCallback(error) {
		this.dialogService.showConfirmDialog(error.message);
	}

	private removeNode(node) {
		this.lessonLearnedSetupAPIService.removeCategory(
			node).then(
				(arg) => { this.removeNodeSuccessCallback(arg); },
				(arg) => { this.removeNodeErrorCallback(arg); },
		);
	}

	private removeNodeSuccessCallback(result) {

		const parentChildren = this.roleList[result.parentId].children;

		// remove o filho que esta no array do pai
		for (const i in parentChildren) {
			if (result.id === parentChildren[i].id) {
				parentChildren.splice(i, 1);
			}
		}
		delete this.roleList[result.id];
	}

	private removeNodeErrorCallback(error) {
		this.dialogService.showConfirmDialog(error.message);
	}

	public actionClickSelectItem(node) {
		if (this.$scope.category.lastSelected != null) {
			this.$scope.category.lastSelected.selected = false;
		}

		this.$scope.category.lastSelected = node;

		node.selected = true;
	}

	private makeTreeStructure(data) {

		const objList = data;
		const categoryData = [];

		for (const i in objList) {

			objList[i].children = [];
			objList[i].selected = false;

			const currentObj = objList[i];

			// child to parent
			if (currentObj.parentId == null || currentObj.parentId === undefined) {
				categoryData.push(objList[i]);
			} else {
				objList[currentObj.parentId].children.push(currentObj);
			}
		}

		this.$scope.category.roleList = categoryData;
	}

	public hasChildren(node) {
		const children = node.children;

		if (children.length > 0) {
			return true;
		}

		return false;
	}
}
