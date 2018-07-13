import { OperationSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/operation-setupapi.service';

export class OperationviewonlyController {
	// 'use strict';

	// angular.module('xpd.operationviewonly').controller('operationviewonlyController', operationviewonlyController);

	public static $inject = ['$scope', '$filter', '$sce', 'operationSetupAPIService'];
	public toDate: (element: any) => any;

	constructor($scope, $filter, $sce, operationSetupAPIService: OperationSetupAPIService) {
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

		const queryDict = {};
		location.search.substr(1).split('&').forEach(function (item) {
			queryDict[item.split('=')[0]] = item.split('=')[1];
		});

		const operationId = (queryDict as any).operationid;

		const vm = this;

		vm.toDate = toDate;

		$scope.dados = {
			operation: null,
		};

		$scope.dados.timeSlices = [];

		$scope.htmlPopover = getHtmlPopOver();

		operationSetupAPIService.getObjectById(operationId,
			loadOperationCallback,
			loadOperationErrorCallback);

		function loadOperationCallback(data) {

			const contractParams = {};

			// Array to Object
			for (const i in data.contractParams) {
				contractParams[data.contractParams[i].type] = data.contractParams[i];
				delete contractParams[data.contractParams[i].type].type;
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

			$scope.dados.timeSlices = data.timeSlices;
			// $scope.dados.timeSlices = $filter('orderBy')($filter('filter')(data.timeSlices, { enabled: true }), 'timeOrder');
			$scope.dados.contractParams = contractParams;
			$scope.dados.alarms = data.alarms;
			delete data.timeSlices;
			delete data.contractParams;
			delete data.alarms;

			$scope.dados.operation = data;
		}

		function toDate(element) {
			return $filter('date')(new Date(element), 'short', '+0000');
		}

		function loadOperationErrorCallback() {
			console.log('Error loading Operation!');
		}

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

		function getHtmlPopOver() {
			return $sce.trustAsHtml('<img class="img-responsible" width="200px" height="auto" src="../xpd-resources/img/imagem_acceleration.png">');
		}

	}
}
