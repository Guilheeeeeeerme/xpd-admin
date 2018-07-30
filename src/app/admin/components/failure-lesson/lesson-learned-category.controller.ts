import * as angular from 'angular';
import { IModalService } from 'angular-ui-bootstrap';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { LessonLearnedSetupAPIService } from '../../../shared/xpd.setupapi/lessonlearned-setupapi.service';
import { CategoryController } from './category.controller';

export class LessonLearnedCategoryController extends CategoryController {
	// 'use strict';

	// 	.controller('LessonLearnedCategoryController', lessonLearnedCategoryController);

	public static $inject = ['$scope', '$uibModal', 'dialogService', 'lessonLearnedSetupAPIService'];

	constructor(
		$scope: any,
		$modal: IModalService,
		dialogService: DialogService,
		lessonLearnedSetupAPIService: LessonLearnedSetupAPIService) {
		super($scope, $modal, dialogService, lessonLearnedSetupAPIService);

		$scope.titleTemplate = 'Categories (Lessons Learned)';
		$scope.controller = this;
	}
}
