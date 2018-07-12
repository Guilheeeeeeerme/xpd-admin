(function() {
	'use strict';

	angular.module('xpd.reports')
		.controller('DepthController', depthController);

	depthController.$inject = ['$scope', '$routeParams', 'reportSetupAPIService'];

	function depthController($scope, $routeParams, reportSetupAPIService) {

		let vm = this;

		$scope.depthData = {
			plannedDataChart: {
				vOptimum: null,
				vPoor: null,
				vStandard: null,
			},
			realizedDataChart: null,
			plotBandsPlannedData: [],
		};

		let operationId = $routeParams.operationId;

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
			console.log('planejado', result);

			$scope.depthData.plannedDataChart.vOptimum = result.points_voptimum;
			$scope.depthData.plannedDataChart.vPoor = result.points_vpoor;
			$scope.depthData.plannedDataChart.vStandard = result.points_vstandard;

			let black = '#000';
			let rgb_value = 154;
			for (let i = 1, len = result.depthLimits.length; i < len; i++) {

				let plotBand = new Object();

				plotBand.from = result.depthLimits[i - 1].endDepth;
				plotBand.to = result.depthLimits[i].endDepth;
				plotBand.text = result.depthLimits[i].title;

				rgb_value -= 30;
				plotBand.backgroundColor = rgbToHex(200, rgb_value, rgb_value);

				plotBand.textColor = black;

				$scope.depthData.plotBandsPlannedData.push(plotBand);
			}

			function rgbToHex(red, green, blue) {
				let rgb = blue | (green << 8) | (red << 16);
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
})();
