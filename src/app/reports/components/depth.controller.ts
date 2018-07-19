import { route } from 'angular';
import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';

export class DepthController {
	// 'use strict';

	public static $inject = ['$scope', '$routeParams', 'reportSetupAPIService'];

	constructor(
		private $scope: any,
		private $routeParams: route.IRouteService,
		private reportSetupAPIService: ReportsSetupAPIService) {

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

		const operationId = ($routeParams as any).operationId;

		this.getEventsDataChart(operationId);
	}

	private getEventsDataChart(operationId) {

		this.reportSetupAPIService.getPlannedGraphicDataOperation(
			operationId).then(
				(arg) => { this.getPlannedGraphicDataOperationSuccessCallback(arg); },
				(arg) => { this.getPlannedGraphicDataOperationErrorCallback(arg); },
		);

		this.reportSetupAPIService.getRealizedGraphicDataOperation(
			operationId).then(
				(arg) => { this.getRealizedGraphicDataOperationSuccessCallback(arg); },
				(arg) => { this.getRealizedGraphicDataOperationErrorCallback(arg); },
		);
	}

	private getPlannedGraphicDataOperationSuccessCallback(result) {

		const rgbToHex = (red, green, blue) => {
			// tslint:disable-next-line:no-bitwise
			const rgb = blue | (green << 8) | (red << 16);
			return '#' + (0x1000000 + rgb).toString(16).slice(1);
		};

		this.$scope.depthData.plannedDataChart.vOptimum = result.points_voptimum;
		this.$scope.depthData.plannedDataChart.vPoor = result.points_vpoor;
		this.$scope.depthData.plannedDataChart.vStandard = result.points_vstandard;

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

			this.$scope.depthData.plotBandsPlannedData.push(plotBand);
		}
	}

	private getPlannedGraphicDataOperationErrorCallback(error) {
		console.log(error);
	}

	private getRealizedGraphicDataOperationSuccessCallback(result) {
		console.log('realizado', result);

		this.$scope.depthData.realizedDataChart = result.points;
	}

	private getRealizedGraphicDataOperationErrorCallback(error) {
		console.log(error);
	}

}
// })();
