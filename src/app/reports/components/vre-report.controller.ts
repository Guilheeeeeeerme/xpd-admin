import { ReportsSetupAPIService } from '../../shared/xpd.setupapi/reports-setupapi.service';
import { WellSetupAPIService } from '../../shared/xpd.setupapi/well-setupapi.service';

export class VREReportController {
	// 'use strict';

	public static $inject = ['$scope', 'wellSetupAPIService', 'reportsSetupAPIService'];

	constructor(
		private $scope: any,
		private wellSetupAPIService: WellSetupAPIService,
		private reportsSetupAPIService: ReportsSetupAPIService) {

		$scope.vreData = {
			vreList: null,
			vreDaily: null,
			fromDate: null,
			toDate: null,
			period: null,
		};

		// --actions--
		this.getWellList();
	}

	public onClickFilterButton(fromDate, toDate) {
		this.$scope.$parent.rController.getFailuresOnInterval(fromDate, toDate);

		this.$scope.vreData.period = {
			fromDate: fromDate,
			toDate: toDate,
		};

		this.reportsSetupAPIService.getVreList(fromDate, toDate).then(
			(arg) => { this.vreListSuccessCallback(arg); },
			(arg) => { this.vreListErrorCallback(arg); },
		);
	}

	// --implements--
	private getWellList() {
		this.wellSetupAPIService.getList().then(
			(wellList) => { this.getWellSuccessCallback(wellList); },
			(arg) => { this.getWellErrorCallback(arg); });
	}

	private getWellSuccessCallback(result) {

		const parentData = this.$scope.reportsData;

		this.$scope.vreData.period = {
			fromDate: parentData.fromDate,
			toDate: parentData.toDate,
		};

		this.reportsSetupAPIService.getVreList(
			parentData.fromDate,
			parentData.toDate).then(
				(arg) => { this.vreListSuccessCallback(arg); },
				(arg) => { this.vreListErrorCallback(arg); },
		);
	}

	private getWellErrorCallback(error) {
		console.log(error);
	}

	private vreListSuccessCallback(result) {
		this.$scope.vreData.vreList = result;
		this.vreDaily(result);
	}

	private vreListErrorCallback(error) {
		console.log(error);
	}

	private vreDaily(vreList) {
		const day = (this.$scope.reportsData.toDate / 1000) - (this.$scope.reportsData.fromDate / 1000);
		let runningTime = 0;
		let vreTotal = 0;
		let remainingTime = 0;

		for (let i = vreList.length - 1; i >= 0; i--) {
			vreTotal += (vreList[i].time * vreList[i].vre);
			runningTime += vreList[i].time;
		}
		vreTotal /= day;
		remainingTime = Math.abs(day - runningTime);

		this.$scope.vreData.vreDaily = { totalTime: runningTime, vreTotal: vreTotal, remainingTime: remainingTime };

	}
}
// })();
