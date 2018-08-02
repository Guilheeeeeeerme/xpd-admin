import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { CategorySetupAPIService } from '../../../shared/xpd.setupapi/category-setupapi.service';
import { CategoryController } from './category.controller';

export class FailureDelayCategoryController extends CategoryController {
	// 'use strict';

	// 	.controller('FailureDelayCategoryController', failureDelayCategoryController);

	public static $inject = ['$scope', '$uibModal', 'dialogService', 'categorySetupAPIService'];

	constructor(
		$scope: any,
		$modal: IModalService,
		dialogService: DialogService,
		categorySetupAPIService: CategorySetupAPIService) {
		super($scope, $modal, dialogService, categorySetupAPIService);

		$scope.titleTemplate = 'Categories(Failure / Delay)';
		$scope.controller = this;
	}
}
