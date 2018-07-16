import { OperationSetupAPIService } from '../../../shared/xpd.setupapi/operation-setupapi.service';

export class OperationViewOnlyController {
	// 'use strict';

	// angular.module('xpd.operationviewonly').controller('OperationViewOnlyController', OperationViewOnlyController);

	public static $inject = ['$scope', '$routeParams', '$filter', '$sce', 'operationSetupAPIService'];

	constructor(
		private $scope: any,
		$routeParams: angular.route.IRouteParamsService,
		private $filter,
		private $sce: ng.ISCEService,
		operationSetupAPIService: OperationSetupAPIService) {

		const vm = this;

		$scope.casingTypeSizeItems = [];

		$scope.casingTypeSizeItems = [{
			id: 'casing12SemiFlush',
			label: 'Less than 12" semi flush or conventinal',
		}, {
			id: 'casing12Flush',
			label: 'Less than 12" flush',
		}, {
			id: 'casing16SemiFlush',
			label: 'Greater than or equal to 12" and smaller than 16" semi flush or conventional',
		}, {
			id: 'casing16Flush',
			label: 'Greater than or equal to 12" and smaller than 16" flush',
		}, {
			id: 'casing24',
			label: 'Greater than or equal to 16" and smaller than 24"',
		}, {
			id: 'casing24Plus',
			label: 'Greater than or equal to 24"',
		}];

		// $scope.casingTypeSizeItems[3] = [{
		// 	id: 1,
		// 	label: 'Section of 3 joints of casing smaller than 12"'
		// }, {
		// 	id: 2,
		// 	label: 'Section of 3 joints of casing greater than or equal to 12" and smaller than 16"'
		// }];

		$routeParams.operationId = +$routeParams.operationId;
		const operationId = $routeParams.operationId;

		$scope.dados = {
			operation: null,
		};

		$scope.dados.timeSlices = [];

		$scope.htmlPopover = this.getHtmlPopOver();

		operationSetupAPIService.getObjectById(operationId,
			(operation: any) => {
				vm.loadOperationCallback(operation);
			},
			() => {
				vm.loadOperationErrorCallback();
			});

		$scope.set = [
			{
				id: 1,
				label: 'AAAAA',
			},
			{
				id: 2,
				label: 'BBBBB',
			},
			{
				id: 3,
				label: 'CCCCC',
			},
		];

	}

	private loadOperationCallback(operation) {

		const contractParams = {};

		// Array to Object
		for (const i in operation.contractParams) {
			contractParams[operation.contractParams[i].type] = operation.contractParams[i];
			delete contractParams[operation.contractParams[i].type].type;
		}

		// try{
		// 	$scope.dados.timeSlices = data.timeSlices.map(function(ts){
		// 		if(ts.enabled == false){
		// 			ts.enabled = false;
		// 		}else{
		// 			ts.enabled = true;
		// 		}

		// 		return ts;
		// 	});
		// }catch(_ex){
		// 	console.error(_ex);
		// }

		this.$scope.dados.timeSlices = operation.timeSlices;
		// $scope.dados.timeSlices = $filter('orderBy')($filter('filter')(data.timeSlices, { enabled: true }), 'timeOrder');
		this.$scope.dados.contractParams = contractParams;
		this.$scope.dados.alarms = operation.alarms;
		delete operation.timeSlices;
		delete operation.contractParams;
		delete operation.alarms;

		this.$scope.dados.operation = operation;
	}

	private loadOperationErrorCallback() {
		console.log('Error loading Operation!');
	}

	private getHtmlPopOver() {
		return this.$sce.trustAsHtml('<img class="img-responsible" width="200px" height="auto" src="../xpd-resources/img/imagem_acceleration.png">');
	}

	public toDate(element: any) {
		return this.$filter('date')(new Date(element), 'short', '+0000');
	}
}
