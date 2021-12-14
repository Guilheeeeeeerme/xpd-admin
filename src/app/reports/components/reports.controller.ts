import { OperationDataService } from '../../shared/xpd.operation-data/operation-data.service';
import { OperationSetupAPIService } from '../../shared/xpd.setupapi/operation-setupapi.service';
import { WellSetupAPIService } from '../../shared/xpd.setupapi/well-setupapi.service';

export class ReportsController {

	public static $inject = ['$scope', 'operationSetupAPIService', 'wellSetupAPIService', 'operationDataService'];
	public operationDataFactory: any;

	constructor(
		public $scope,
		public operationSetupAPIService: OperationSetupAPIService,
		public wellSetupAPIService: WellSetupAPIService,
		public operationDataService: OperationDataService) {

		// --declarations--
		const vm = this;

		$scope.reportsData = {
			currentOperation: null,
			operationList: null,
			currentWell: null,
			wellList: null,
			reportList: null,
			fromDate: null,
			toDate: null,
		};

		operationDataService.openConnection(['failure']).then(() => {

			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = vm.operationDataFactory.operationData;

			operationDataService.on($scope, 'setOnFailureChangeListener', () => { this.onFailureChange(); });

		});

		// --actions--
		if (!localStorage.getItem('xpd.admin.reports.reportsData.toDate') || !localStorage.getItem('xpd.admin.reports.reportsData.fromDate')) {
			this.setCurrentDate();
		} else {
			$scope.reportsData.toDate = new Date(localStorage.getItem('xpd.admin.reports.reportsData.toDate'));
			$scope.reportsData.fromDate = new Date(localStorage.getItem('xpd.admin.reports.reportsData.fromDate'));
		}

		this.getWellList();

		operationSetupAPIService.getList().then(
			(arg) => { this.currentOperationSuccessCallback(arg); },
			(arg) => { this.currentOperationErrorCallback(arg); });
	}

	public getFailuresOnInterval(startTime, endTime) {

		this.$scope.reportsData.failuresOnInterval = null;

		const startInterval = new Date(startTime).getTime();
		const endInterval = new Date(endTime).getTime();

		if (startTime && endTime) {
			this.$scope.reportsData.failuresOnInterval = this.checkNptOnInterval(startInterval, endInterval);
		}

		this.setCurrentDate();

	}

	private onFailureChange() {
		this.getFailuresOnInterval(this.$scope.reportsData.fromDate, this.$scope.reportsData.toDate);
	}

	private setCurrentDate() {

		try {
			this.$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
		} catch (e) {
			this.$scope.reportsData.fromDate = new Date();
			this.$scope.reportsData.fromDate.setHours(0, 0, 0, 0);
		}

		try {
			this.$scope.reportsData.toDate.setHours(23, 59, 59, 999);
		} catch (e) {
			this.$scope.reportsData.toDate = new Date();
			this.$scope.reportsData.toDate.setHours(23, 59, 59, 999);
		}

		localStorage.setItem('xpd.admin.reports.reportsData.toDate', this.$scope.reportsData.toDate.toISOString());
		localStorage.setItem('xpd.admin.reports.reportsData.fromDate', this.$scope.reportsData.fromDate.toISOString());

	}

	// --implements--
	private getWellList() {
		this.wellSetupAPIService.getList().then(
			(wells) => { this.getWellSuccessCallback(wells); },
			(arg) => { this.getWellErrorCallback(arg); });
	}

	private getWellSuccessCallback(result) {
		this.$scope.reportsData.wellList = result;

		for (const i in result) {
			if (result[i].current) {
				this.$scope.reportsData.currentWell = result[i];
			}
		}

		this.makeReportList(this.$scope.reportsData.currentWell);
	}

	private getWellErrorCallback(error) {
		console.log(error);
	}

	private currentOperationSuccessCallback(operationList) {
		this.$scope.reportsData.operationList = operationList;

		for (let i = operationList.length - 1; i >= 0; i--) {
			if (operationList[i].current) {
				this.$scope.reportsData.currentOperation = operationList[i];
			}
		}

	}

	private currentOperationErrorCallback(error) {
		console.log(error);
	}

	private makeReportList(currentWell) {

		this.$scope.reportsData.reportList = [
			{ type: 'VRE', url: '#/vre' },
			{ type: 'VRE x Consistence', url: '#/vre-score' },
			{ type: 'Histogram', url: '#/histogram' },
			{ type: 'Needle Report', url: '#/needle-report' },
			{ type: 'Failures/NPT', url: '#/failures-npt' },
			{ type: 'Lessons Learned', url: '#/lessons-learned' },
			// {type:'VRE', url:'#/operation/'+operationId},
			// {type:"Daily", url:"#/operation/"+operationId+"/daily"},
			// {type:'Connections', url:'#/operation/'+operationId+'/connections'},
			// {type:'Trips', url:'#/operation/'+operationId+'/trips'},
			// {type:'Time vs Depth', url:'#/time-vs-depth'},
			// {type:'Time vs Depth', url:'#/operation/'+operationId+'/time-vs-depth'},
			// {type:"Failures", url:"#/operation/"+operationId+"/failures"},
			// {type:"Improvements", url:"#/operation/"+operationId+"/improvements"},
		];

		if (currentWell) {
			this.$scope.reportsData.reportList.push({ type: 'Bit Depth x Time', url: '#/bit-depth-time/' + currentWell.id });
		}
	}

	private checkNptOnInterval(startInterval, endInterval) {

		const failureList = this.operationDataFactory.operationData.failureContext.failureList;
		const failuresOnInterval = [];

		for (const i in failureList) {
			const failure = failureList[i];

			if (failure.npt) {
				const failureStartTime = new Date(failure.startTime).getTime();
				const failureEndTime = new Date(failure.endTime).getTime();

				const onGoingCondition = (failure.onGoing && (failureStartTime <= endInterval));

				if ((failureEndTime >= startInterval) && (failureStartTime <= endInterval) || onGoingCondition) {
					failuresOnInterval.push(failure);
				}
			}
		}

		return failuresOnInterval;
	}

}
