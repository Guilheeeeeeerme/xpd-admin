import { IModalService } from 'angular-ui-bootstrap';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import { FailuresLassonsController } from './failures-lessons.controller';

export class FailuresNptController extends FailuresLassonsController {
	// 'use strict';

	public static $inject = ['$scope', '$uibModal', 'reportsSetupAPIService'];

	constructor(
		$scope: any,
		$modal: IModalService,
		reportsSetupAPIService: ReportsSetupAPIService) {
		super($scope, $modal, reportsSetupAPIService);

		$scope.type = 'failures';
		$scope.category = 'category';

		$scope.chartPrimaryTitle = 'Failure';
		$scope.chartSecondaryTitle = 'NPT';
		$scope.paretoTitle = 'Failure / NPT';
		$scope.modalTitle = 'Failure / Delay List';
		$scope.breadcrumbsName = 'Failure / Delay Categories';

		new FailuresLassonsController($scope, $modal, reportsSetupAPIService).getFailureList();

	}
}
