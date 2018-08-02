import { IModalService } from 'angular-ui-bootstrap';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import { FailuresLassonsController } from './failures-lessons.controller';

export class LessonsLearnedController extends FailuresLassonsController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModal', 'reportsSetupAPIService'];

	constructor(
		$scope: any,
		$modal: IModalService,
		reportsSetupAPIService: ReportsSetupAPIService) {
		super($scope, $modal, reportsSetupAPIService);

		$scope.type = 'lessons_learned';
		$scope.category = 'lessonLearnedCategory';

		$scope.chartPrimaryTitle = 'Lesson';
		$scope.chartSecondaryTitle = 'B. Pract.';
		$scope.paretoTitle = 'Lessons / Learned';
		$scope.modalTitle = 'Lessons / Learned List';
		$scope.breadcrumbsName = 'Lessons / Learned Categories';

		new FailuresLassonsController($scope, $modal, reportsSetupAPIService).getLessonList();

	}
}
