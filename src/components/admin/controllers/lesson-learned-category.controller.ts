import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogFactory } from '../../../xpd-resources/ng/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/lessonlearned-setupapi.service';
/*
* @Author: gustavogomides7
* @Date:   2017-02-24 16:27:37
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 11:31:26
*/
export class LessonLearnedCategoryController {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.controller('LessonLearnedCategoryController', lessonLearnedCategoryController);

	public static $inject = ['$scope', '$uibModal', 'dialogFactory', 'lessonLearnedSetupAPIService'];
	public actionClickAdd: (parentNode: any) => void;
	public actionClickEdit: (node: any) => void;
	public actionClickRemove: (node: any) => void;
	public modalActionButtonSave: () => void;
	public modalActionButtonClose: () => void;
	public actionClickSelectItem: (node: any) => void;
	public hasChildren: (node: any) => boolean;

	constructor(
		$scope: any,
		$modal: IModalService,
		dialogFactory: DialogFactory,
		lessonLearnedSetupAPIService: LessonLearnedSetupAPIService) {

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

		let roleList = {};

		vm.actionClickAdd = actionClickAdd;
		vm.actionClickEdit = actionClickEdit;
		vm.actionClickRemove = actionClickRemove;
		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionClickSelectItem = actionClickSelectItem;
		vm.hasChildren = hasChildren;

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
				scope: $scope,
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
				scope: $scope,
			});
		}

		function actionClickRemove(node) {

			dialogFactory.showConfirmDialog('Do you want to remove this category?',
				function () {
					removeNode(node);
				},
			);
		}

		function modalActionButtonSave() {
			if (!$scope.newNode.id) {
				saveNode($scope.newNode);
			} else {
				updateNode($scope.newNode);
			}
		}

		function modalActionButtonClose() {
			$scope.$modalInstance.close();
		}

		function saveNode(node) {
			lessonLearnedSetupAPIService.insertCategory(
				node,
				saveNodeSuccessCallback,
				upsertNodeErrorCallback,
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
			lessonLearnedSetupAPIService.updateCategory(
				node,
				updateNodeSuccessCallback,
				upsertNodeErrorCallback,
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
			lessonLearnedSetupAPIService.removeCategory(
				node,
				removeNodeSuccessCallback,
				removeNodeErrorCallback,
			);
		}

		function removeNodeSuccessCallback(result) {

			const parentChildren = roleList[result.parentId].children;

			// remove o filho que esta no array do pai
			for (const i in parentChildren) {
				if (result.id === parentChildren[i].id) {
					parentChildren.splice(i, 1);
				}
			}
			delete roleList[result.id];
		}

		function removeNodeErrorCallback(error) {
			dialogFactory.showConfirmDialog(error.message);
		}

		function actionClickSelectItem(node) {
			if ($scope.category.lastSelected != null) {
				$scope.category.lastSelected.selected = false;
			}

			$scope.category.lastSelected = node;

			node.selected = true;
		}

		function makeTreeStructure(data) {

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

			$scope.category.roleList = categoryData;
		}

		function hasChildren(node) {
			const children = node.children;

			if (children.length > 0) {
				return true;
			}

			return false;
		}
	}
}
