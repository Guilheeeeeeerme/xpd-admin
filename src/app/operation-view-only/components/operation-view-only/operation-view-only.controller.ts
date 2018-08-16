import { OperationConfigurationService } from '../../../shared/operation-configuration/operation-configuration.service';
import { OperationSetupAPIService } from '../../../shared/xpd.setupapi/operation-setupapi.service';

export class OperationViewOnlyController {

	public static $inject = ['$scope', '$routeParams', '$filter', OperationConfigurationService.name, 'operationSetupAPIService'];

	constructor(
		private $scope: any,
		private $routeParams: angular.route.IRouteParamsService,
		private $filter,
		private operationConfigurationService: OperationConfigurationService,
		private operationSetupAPIService: OperationSetupAPIService) {

		const vm = this;

		$scope.casingTypeSizeItems = operationConfigurationService.getCasingTypeSizeItems();
		$scope.htmlPopover = operationConfigurationService.getImageAceleration();

		$routeParams.operationId = +$routeParams.operationId;
		const operationId = $routeParams.operationId;

		$scope.dados = {
			operation: null,
		};

		$scope.dados.timeSlices = [];

		operationSetupAPIService.getOperationById(operationId).then(
			(operation: any) => {
				vm.loadOperationCallback(operation);
			},
			() => {
				vm.loadOperationErrorCallback();
			});

	}

	public toDate(element: any) {
		return this.$filter('date')(new Date(element), 'short', '+0000');
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
}
