// (function() {

// 	'use strict',

// 	modalFailureController.$inject = ['$scope', '$uibModalInstance', 'categorySetupAPIService', 'failureSetupAPIService', 'selectedFailure', 'dialogService', 'operationDataService'];

//
import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';
import { CategorySetupAPIService } from '../xpd.setupapi/category-setupapi.service';
import { FailureSetupAPIService } from '../xpd.setupapi/failure-setupapi.service';

export class ModalFailureController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'categorySetupAPIService',
		'failureSetupAPIService',
		'selectedFailure',
		'dialogService',
		'operationDataService',
	];

	public operationDataFactory: any;
	public roleList: {};

	constructor(
		private $scope: any,
		private $uibModalInstance: IModalServiceInstance,
		private categorySetupAPIService: CategorySetupAPIService,
		private failureSetupAPIService: FailureSetupAPIService,
		private selectedFailure: any,
		private dialogService: DialogService,
		private operationDataService: OperationDataService) {

		const vm = this;

		this.roleList = {};

		$scope.selectedFailure = angular.copy(selectedFailure);

		$scope.toMilli = (arg) => { vm.toMilli(arg); };
		$scope.now = () => { vm.now(); };
		$scope.keepTimeBeforeNow = () => { vm.keepTimeBeforeNow(); };

		operationDataService.openConnection([]).then(() => {
			vm.operationDataFactory = operationDataService.operationDataFactory;
		});

		$scope.category = {
			roleList: [],
			lastSelected: null,
			breadcrumbs: 'Failure / Delay categories',
		};

		this.getCategoryList();
		this.getFailuresOnGoing();

	}
	private getCategoryList() {
		this.categorySetupAPIService.getListCategory().then(
			(arg) => { this.getCategoryListSuccessCallback(arg); },
			(arg) => { this.getCategoryListErrorCallback(arg); },
		);
	}

	private getCategoryListSuccessCallback(result) {
		this.roleList = result;
		this.makeTreeStructure(this.roleList);
	}public getListCategory;

	private getCategoryListErrorCallback(error) {
		console.log(error);
	}

	private toMilli(param) {
		const date = new Date(param);
		return date.getTime();
	}

	private now() {
		// tslint:disable-next-line:no-shadowed-variable
		const now = new Date();
		now.setSeconds(0);
		now.setMilliseconds(0);
		return now;
	}

	private keepTimeBeforeNow() {
		const currentTime = this.now();

		if (this.$scope.selectedFailure.endTime && this.toMilli(this.$scope.selectedFailure.endTime) > currentTime.getTime()) {
			this.$scope.selectedFailure.endTime = currentTime;
		}
	}

	private getFailuresOnGoing() {

		this.failureSetupAPIService.listFailuresOnGoing().then(
			(response: any) => {
				if (response.length === 0) {
					this.$scope.selectedFailure.onGoingFlag = true;
				} else {
					this.$scope.selectedFailure.onGoingFlag = false;
				}
			});
	}

	public modalActionButtonSave() {
		const failure = this.$scope.selectedFailure;

		if (!failure.id) {
			this.registerFailure(failure);
		} else {
			this.updateFailure(failure);
		}
	}

	private registerFailure(failure) {
		this.operationDataFactory.emitInsertFailure(failure);
		this.upsertListenerCallback();
	}

	private updateFailure(failure) {
		this.operationDataFactory.emitUpdateFailure(failure);
		this.upsertListenerCallback();
	}

	private upsertListenerCallback() {
		this.operationDataService.on('setOnFailureChangeListener', () => { this.failureSuccessCallback(); });
		this.operationDataService.on('setOnErrorUpsertFailureListener', () => { this.failureErrorCallback(); });
		this.operationDataService.on('setOnNptAlreadyExistsListener', () => { this.nptAlreadyExists(); });
	}

	private failureSuccessCallback() {
		this.$uibModalInstance.close();
	}

	private failureErrorCallback() {
		this.dialogService.showConfirmDialog('Error on inserting failure, please try again!', () => {
			// faça nada
		});
	}

	private nptAlreadyExists() {
		this.dialogService.showConfirmDialog('NPT already exists in this time interval!', () => {
			// faça nada
		});
	}

	public modalActionButtonClose() {
		this.$uibModalInstance.close();
	}

	public actionOnGoingCheckboxClick(value) {
		this.$scope.selectedFailure.onGoing = value;

		if (value) {
			this.$scope.selectedFailure.endTime = null;
		}
	}

	private makeTreeStructure(data) {

		const objList = data;
		const categoryData = [];

		for (const i in objList) {
			if (this.$scope.selectedFailure.category) {

				if (this.$scope.selectedFailure.category.id != null) {
					if (this.$scope.selectedFailure.category.id === objList[i].id) {
						objList[i].selected = true;
						this.$scope.category.lastSelected = objList[i];
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

		this.$scope.category.roleList = categoryData;
	}

	public actionClickSelectItem(node) {
		this.makeBreadCrumbs(node);

		if (this.$scope.category.lastSelected != null) {
			this.$scope.category.lastSelected.selected = false;
		}

		this.$scope.category.lastSelected = node;

		// reset
		this.$scope.selectedFailure.category = {};

		this.$scope.selectedFailure.category.id = node.id;

		node.selected = true;
	}

	private makeBreadCrumbs(node) {
		this.$scope.category.breadcrumbs = 'Failure / Delay categories';

		const objList = this.roleList;
		let parentNode = node.parentId;
		let breadcrumbs = node.initial + ' - ' + node.name;

		for (const i in objList) {
			if (parentNode > 1) {
				breadcrumbs = objList[parentNode].initial + ' - ' + objList[parentNode].name + ' > ' + breadcrumbs;
			} else {
				this.$scope.category.breadcrumbs += ' > ' + breadcrumbs;
				return;
			}
			parentNode = objList[parentNode].parentId;
		}
	}

}
