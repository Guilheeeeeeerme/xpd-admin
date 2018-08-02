import * as angular from 'angular';
import { IQService } from '../../../../../../node_modules/@types/angular';
import { ReportsSetupAPIService } from '../../../../shared/xpd.setupapi/reports-setupapi.service';
import { OperationActivitiesEstimatorService } from '../operation-activities-estimator/operation-activities-estimator.service';
import template from './operation-queue-forecast.template.html';

export class XPDOperationQueueForecastDirective implements ng.IDirective {
	public static $inject = ['$q', 'reportsSetupAPIService'];
	public static Factory(): ng.IDirectiveFactory {
		return (
			$q: IQService,
			reportsSetupAPIService: ReportsSetupAPIService,
		) => new XPDOperationQueueForecastDirective($q, reportsSetupAPIService);
	}

	public template = template;
	public scope = {
		startTime: '@',
		currentWellId: '@',
		currentOperationId: '@',
		operationQueue: '=',
	};

	constructor(
		private $q: IQService,
		private reportsSetupAPIService: ReportsSetupAPIService) {

	}

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		const operationActivitiesEstimatorService: OperationActivitiesEstimatorService = new OperationActivitiesEstimatorService();

		const processPlanning = (estimativesList: any[]) => {

			const nextActivitiesEstimativesList = [];

			let operationFinalTimeEstimative = angular.copy(+scope.startTime);

			for (const estimatives of estimativesList) {
				const nextActivitiesEstimatives = operationActivitiesEstimatorService.estimateNextActivities(operationFinalTimeEstimative, estimatives);

				nextActivitiesEstimativesList.push(nextActivitiesEstimatives);

				for (const activity of nextActivitiesEstimatives) {
					operationFinalTimeEstimative = Math.max(activity.finalTime, operationFinalTimeEstimative);
				}

			}

			scope.nextActivitiesEstimativesList = nextActivitiesEstimativesList;

		};

		scope.$watch('operationQueue', (operationQueue) => {

			let planningPromises = [];

			if (operationQueue) {

				scope.validOperations = operationQueue.filter((operation) => {
					return +operation.id !== +scope.currentOperationId;
				});

				planningPromises = scope.validOperations.map((operation) => {
					return this.reportsSetupAPIService.getOperationEstimative(scope.currentWellId, operation.id);
				});

				this.$q.all(planningPromises).then((data) => {
					processPlanning(data);
				});

			}

		});

	}

}
