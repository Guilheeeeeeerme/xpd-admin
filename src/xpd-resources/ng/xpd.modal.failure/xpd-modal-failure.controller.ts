// (function() {

// 	'use strict',

// 	angular.module('xpd.modal-failure').controller('modalFailureController', modalFailureController);

// 	modalFailureController.$inject = ['$scope', '$uibModalInstance', 'categorySetupAPIService', 'failureSetupAPIService', 'selectedFailure', 'dialogFactory', 'operationDataFactory'];

//
import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';

export class ModalFailureController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'categorySetupAPIService',
		'failureSetupAPIService',
		'selectedFailure',
		'dialogFactory',
		'operationDataFactory',
	];
	public modalActionButtonSave: () => void;
	public modalActionButtonClose: () => void;
	public actionOnGoingCheckboxClick: (value: any) => void;
	public actionClickSelectItem: (node: any) => void;

	constructor(
		$scope: any,
		$uibModalInstance: IModalServiceInstance,
		categorySetupAPIService: CategorySetupAPIService,
		failureSetupAPIService: FailureSetupAPIService,
		selectedFailure: any,
		dialogFactory: DialogFactory,
		operationDataFactory: OperationDataFactory) {

		const vm = this;

		let roleList = {};

		$scope.selectedFailure = angular.copy(selectedFailure);

		$scope.toMilli = toMilli;
		$scope.now = now;
		$scope.keepTimeBeforeNow = keepTimeBeforeNow;

		operationDataFactory.openConnection([]).then(function (response) {
			operationDataFactory = response;
		});

		$scope.category = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Failure / Delay categories',
		};

		vm.modalActionButtonSave = modalActionButtonSave;
		vm.modalActionButtonClose = modalActionButtonClose;
		vm.actionOnGoingCheckboxClick = actionOnGoingCheckboxClick;
		vm.actionClickSelectItem = actionClickSelectItem;

		getCategoryList();

		getFailuresOnGoing();

		function getCategoryList() {
			categorySetupAPIService.getList(
				getCategoryListSuccessCallback,
				getCategoryListErrorCallback,
			);
		}

		function getCategoryListSuccessCallback(result) {
			roleList = result;
			makeTreeStructure(roleList);
		}

		function getCategoryListErrorCallback(error) {
			console.log(error);
		}

		function toMilli(param) {
			const date = new Date(param);
			return date.getTime();
		}

		function now() {
			// tslint:disable-next-line:no-shadowed-variable
			const now = new Date();
			now.setSeconds(0);
			now.setMilliseconds(0);
			return now;
		}

		function keepTimeBeforeNow() {
			const currentTime = now();

			if ($scope.selectedFailure.endTime && toMilli($scope.selectedFailure.endTime) > currentTime.getTime()) {
				$scope.selectedFailure.endTime = currentTime;
			}
		}

		function getFailuresOnGoing() {

			failureSetupAPIService.listFailuresOnGoing(function (response) {
				if (response.length === 0) {
					$scope.selectedFailure.onGoingFlag = true;
				} else {
					$scope.selectedFailure.onGoingFlag = false;
				}
			});
		}

		function modalActionButtonSave() {
			const failure = $scope.selectedFailure;

			if (!failure.id) {
				registerFailure(failure);
			} else {
				updateFailure(failure);
			}
		}

		function registerFailure(failure) {
			operationDataFactory.emitInsertFailure(failure);
			upsertListenerCallback();
		}

		function updateFailure(failure) {
			operationDataFactory.emitUpdateFailure(failure);
			upsertListenerCallback();
		}

		function upsertListenerCallback() {
			operationDataFactory.addEventListener('modalFailureController', 'setOnFailureChangeListener', failureSuccessCallback);
			operationDataFactory.addEventListener('modalFailureController', 'setOnErrorUpsertFailureListener', failureErrorCallback);
			operationDataFactory.addEventListener('modalFailureController', 'setOnNptAlreadyExistsListener', nptAlreadyExists);
		}

		function failureSuccessCallback() {
			$uibModalInstance.close();
		}

		function failureErrorCallback() {
			dialogFactory.showConfirmDialog('Error on inserting failure, please try again!');
		}

		function nptAlreadyExists() {
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

			const objList = data;
			const categoryData = [];

			for (const i in objList) {
				if ($scope.selectedFailure.category) {

					if ($scope.selectedFailure.category.id != null) {
						if ($scope.selectedFailure.category.id === objList[i].id) {
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

		function actionClickSelectItem(node) {
			makeBreadCrumbs(node);

			if ($scope.category.lastSelected != null) {
				$scope.category.lastSelected.selected = false;
			}

			$scope.category.lastSelected = node;

			// reset
			$scope.selectedFailure.category = {};

			$scope.selectedFailure.category.id = node.id;

			node.selected = true;
		}

		function makeBreadCrumbs(node) {
			$scope.category.breadcrumbs = 'Failure / Delay categories';

			const objList = roleList;
			let parentNode = node.parentId;
			let breadcrumbs = node.initial + ' - ' + node.name;

			for (const i in objList) {
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
}
