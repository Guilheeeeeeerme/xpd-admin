import { ReportsSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/reports-setupapi.service';
import { WellSetupAPIService } from '../../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class VreReportController {
	// 'use strict';

	// angular.module('xpd.reports').controller('VreReportController', vreReportController);

	public static $inject = ['$scope', 'wellSetupAPIService', 'reportsSetupAPIService'];
	public onClickFilterButton: (fromDate: any, toDate: any) => void;

	constructor($scope, wellSetupAPIService: WellSetupAPIService, reportsSetupAPIService: ReportsSetupAPIService) {
		const vm = this;

		$scope.vreData = {
			vreList: null,
			vreDaily: null,
			fromDate: null,
			toDate: null,
			period: null,
		};

		vm.onClickFilterButton = onClickFilterButton;

		// --actions--
		getWellList();

		// --implements--
		function getWellList() {
			wellSetupAPIService.getList( function(wellList) {
				getWellSuccessCallback(wellList);
			}, getWellErrorCallback);
		}

		function getWellSuccessCallback(result) {

			const currentWell = result[0];

			const parentData = $scope.reportsData;

			$scope.vreData.period = {
				fromDate: parentData.fromDate,
				toDate: parentData.toDate,
			};

			reportsSetupAPIService.getVreList(
				parentData.fromDate,
				parentData.toDate,
				vreListSuccessCallback,
				vreListErrorCallback,
			);
		}

		function getWellErrorCallback(error) {
			console.log(error);
		}

		function vreListSuccessCallback(result) {
			$scope.vreData.vreList = result;
			vreDaily(result);
		}

		function vreListErrorCallback(error) {
			console.log(error);
		}

		function vreDaily(vreList) {
			const day = ($scope.reportsData.toDate / 1000) - ($scope.reportsData.fromDate / 1000);
			let runningTime = 0;
			let vreTotal = 0;
			let remainingTime = 0;

			for (let i = vreList.length - 1; i >= 0; i--) {
				vreTotal += (vreList[i].time * vreList[i].vre);
				runningTime += vreList[i].time;
			}
			vreTotal /= day;
			remainingTime = Math.abs(day - runningTime);

			$scope.vreData.vreDaily = {totalTime: runningTime, vreTotal, remainingTime};

		}

		function onClickFilterButton(fromDate, toDate) {
			$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

			$scope.vreData.period = {
				fromDate,
				toDate,
			};

			reportsSetupAPIService.getVreList(
				fromDate,
				toDate,
				vreListSuccessCallback,
				vreListErrorCallback,
			);
		}
	}
}
// })();
