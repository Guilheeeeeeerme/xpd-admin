import { IModalInstanceService } from 'angular-ui-bootstrap';

export class AlarmModalUpsertController {

	public static $inject: string[] = ['$scope', '$filter', '$uibModalInstance', 'operation', 'alarm', 'actionButtonSaveCallback', 'actionButtonCloseCallback'];

	constructor(
		private $scope: any,
		private $filter: any,
		private $uibModalInstance: IModalInstanceService,
		private $operation: any,
		private $alarm: any,
		private actionButtonSaveCallback: any,
		private actionButtonCloseCallback: any) {

		const vm = this;

		$scope.operation = $operation;
		$scope.alarm = $alarm;

		if (!$scope.alarm.timeSlices) {

			$scope.alarm.timeSlices = {
				tripin: [],
				tripout: [],
			};

		} else {

			$scope.alarm.timeSlices = {
				tripin: $filter('orderBy')($filter('filter')($scope.alarm.timeSlices, { tripin: true, enabled: true }), 'timeOrder'),
				tripout: $filter('orderBy')($filter('filter')($scope.alarm.timeSlices, { tripin: false, enabled: true }), 'timeOrder'),
			};

		}

		this.init();
	}

	public init() {
		if (this.$scope.operation.type === 'time') {
			this.$scope.alarm.alarmType = 'time';
		}
	}

	public actionButtonSave() {

		this.$scope.alarm.timeSlices = this.$scope.alarm.timeSlices.tripin.concat(this.$scope.alarm.timeSlices.tripout);

		if (this.actionButtonSaveCallback) {
			this.actionButtonSaveCallback(this.$scope.alarm);
		}

		this.$uibModalInstance.close();
	}

	public actionButtonClose() {

		if (this.actionButtonCloseCallback) {
			this.actionButtonCloseCallback();
		}

		this.$uibModalInstance.close();
	}

}

// })();
