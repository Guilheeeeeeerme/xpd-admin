import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class DepthController {
	// 'use strict';

	// angular.module('xpd.reports').controller('DepthController', depthController);

	public static $inject = ['$scope', '$routeParams', 'reportSetupAPIService'];

	constructor($scope, $routeParams, reportSetupAPIService: ReportsSetupAPIService) {

		const vm = this;

		$scope.depthData = {
			plannedDataChart: {
				vOptimum: null,
				vPoor: null,
				vStandard: null,
			},
			realizedDataChart: null,
			plotBandsPlannedData: [],
		};

		const operationId = $routeParams.operationId;

		getEventsDataChart(operationId);

		function getEventsDataChart(operationId) {

			reportSetupAPIService.getPlannedGraphicDataOperation(
				operationId,
				getPlannedGraphicDataOperationSuccessCallback,
				getPlannedGraphicDataOperationErrorCallback,
			);

			reportSetupAPIService.getRealizedGraphicDataOperation(
				operationId,
				getRealizedGraphicDataOperationSuccessCallback,
				getRealizedGraphicDataOperationErrorCallback,
			);
		}

		function getPlannedGraphicDataOperationSuccessCallback(result) {

			$scope.depthData.plannedDataChart.vOptimum = result.points_voptimum;
			$scope.depthData.plannedDataChart.vPoor = result.points_vpoor;
			$scope.depthData.plannedDataChart.vStandard = result.points_vstandard;

			const black = '#000';
			let rgbValue = 154;
			for (let i = 1, len = result.depthLimits.length; i < len; i++) {

				const plotBand: any = new Object();

				plotBand.from = result.depthLimits[i - 1].endDepth;
				plotBand.to = result.depthLimits[i].endDepth;
				plotBand.text = result.depthLimits[i].title;

				rgbValue -= 30;
				plotBand.backgroundColor = rgbToHex(200, rgbValue, rgbValue);

				plotBand.textColor = black;

				$scope.depthData.plotBandsPlannedData.push(plotBand);
			}

			function rgbToHex(red, green, blue) {
				const rgb = blue | (green << 8) | (red << 16);
				return '#' + (0x1000000 + rgb).toString(16).slice(1);
  			}
		}

		function getPlannedGraphicDataOperationErrorCallback(error) {
			console.log(error);
		}

		function getRealizedGraphicDataOperationSuccessCallback(result) {
			console.log('realizado', result);

			$scope.depthData.realizedDataChart = result.points;
		}

		function getRealizedGraphicDataOperationErrorCallback(error) {
			console.log(error);
		}
	}
}
// })();
