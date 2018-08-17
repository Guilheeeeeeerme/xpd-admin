import * as angular from 'angular';
import { VCruisingCalculatorService } from '../../../shared/xpd.calculation/calculation.service';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import { ReportsSetupAPIService } from '../../../shared/xpd.setupapi/reports-setupapi.service';

/*
* @Author:
* @Date:   2017-05-19 15:12:22
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-09-19 16:40:21
*/
export class PlannerController {

	public static $inject = ['$scope', '$filter', 'operationDataService', 'dialogService', 'vCruisingCalculator'];
	public operationDataFactory: any;

	constructor(
		private $scope,
		private $filter,
		private operationDataService: OperationDataService,
		private dialogService: DialogService,
		private vCruisingCalculator: VCruisingCalculatorService) {

		$scope.dados = {
			settings: null,
			timeSlices: null,
		};

		operationDataService.openConnection([
			'subOperation',
			'operationProgress',
			'operation',
			'direction',
			'state',
			'timeSlices',
			'vTarget',
		]).then(() => {

			this.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = this.operationDataFactory.operationData;

			const allReady = Promise.all([

				new Promise((resolve, reject) => {
					const watcher = this.$scope.$watch('operationData.timeSlicesContext.timeSlices', (data) => {
						if (data) {
							watcher();
							resolve();
						}
					}, true);
				}),

				new Promise((resolve, reject) => {
					const watcher = this.$scope.$watch('operationData.stateContext.operationStates', (data) => {
						if (data) {
							watcher();
							resolve();
						}
					}, true);
				}),

				new Promise((resolve, reject) => {
					const watcher = this.$scope.$watch('operationData.vtargetContext.vTargetPercentages', (data) => {
						if (data) {
							watcher();
							resolve();
						}
					}, true);
				}),

			]);
			allReady.then(() => {
				this.buildSettingObject();
			});

		});

	}

	public initActionSelectActivityToPlan(stateName, eventType) {
		if (!this.$scope.dados.selectedState || !this.$scope.dados.selectedEventType) {
			this.actionSelectActivityToPlan(stateName, eventType);
		}
	}

	public actionSelectActivityToPlan(stateName, eventType) {

		this.$scope.dados.selectedEventType = null;

		this.$scope.dados.leftPercentage = 0;

		this.$scope.dados.selectedState = stateName;
		this.$scope.dados.selectedEventType = eventType;

	}

	public actionButtonApplyConn() {
		this.dialogService.showConfirmDialog('Are you sure you want to apply this change?', () => {

			try {

				this.$scope.dados.timeSlices.tripin = this.prepareTimeSlices(this.$scope.dados.timeSlices.tripin);
				// .map(addOperationInfo);
				this.$scope.dados.timeSlices.tripout = this.prepareTimeSlices(this.$scope.dados.timeSlices.tripout);
				// .map(addOperationInfo);
				this.operationDataFactory.emitUpdateTimeSlices(this.$scope.dados.timeSlices);

				this.$scope.dados.timeSlices.tripin = this.$filter('filter')(this.$scope.dados.timeSlices.tripin, this.returnValidTimeSlices);
				this.$scope.dados.timeSlices.tripout = this.$filter('filter')(this.$scope.dados.timeSlices.tripout, this.returnValidTimeSlices);

			} catch (e) {
				//
			}

			this.actionButtonApply();

		});

	}

	public actionButtonApplyTrip() {

		this.dialogService.showConfirmDialog('Are you sure you want to apply this change?', () => {

			this.operationDataFactory.emitUpdateInSlips(this.$scope.operationData.operationContext.currentOperation.inSlips);
			this.actionButtonApply();

		});

	}

	private buildSettingObject() {

		this.$scope.dados.settings = {};
		this.$scope.dados.timeSlices = angular.copy(this.$scope.operationData.timeSlicesContext.timeSlices);

		for (const stateName in this.$scope.operationData.stateContext.operationStates) {
			const state = this.$scope.operationData.stateContext.operationStates[stateName];

			for (const eventType in state.calcVREParams) {
				const param = state.calcVREParams[eventType];

				if (eventType !== 'TIME') {
					this.setAllActivitiesParams(stateName, state, eventType, param, state.stateType);
				}

			}
		}

	}

	private setAllActivitiesParams(stateName, state, eventType, params, stateType) {

		if (this.$scope.dados.settings[stateName] == null) {
			this.$scope.dados.settings[stateName] = {};
		}

		if (this.$scope.dados.settings[stateName][eventType] == null) {
			this.$scope.dados.settings[stateName][eventType] = {

				label: stateType + ' [' + eventType + ']',

				stateName,
				stateType: state.calcVREParams[eventType].type,
				eventType,

				optimumAccelerationTimeLimit: +params.accelerationTimeLimit,
				targetAccelerationTimeLimit: +params.accelerationTimeLimit * +this.$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].accelerationTimeLimitPercentage,

				optimumDecelerationTimeLimit: +params.decelerationTimeLimit,
				targetDecelerationTimeLimit: +params.decelerationTimeLimit * +this.$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].decelerationTimeLimitPercentage,

				optimumSafetySpeedLimit: +params.safetySpeedLimit,
				targetSafetySpeedLimit: +params.safetySpeedLimit * +this.$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].safetySpeedLimitPercentage,

				optimumSpeed: +params.voptimum,
				targetSpeed: +params.voptimum * +this.$scope.operationData.vtargetContext.vTargetPercentages[stateName][eventType].voptimumPercentage,
			};
		}

		if (eventType === 'TRIP') {

			let displacement;

			if (stateName === 'casing') {
				displacement = this.$scope.operationData.operationContext.currentOperation.averageSectionLength;
			} else {
				displacement = this.$scope.operationData.operationContext.currentOperation.averageStandLength;
			}

			this.$scope.dados.settings[stateName][eventType].displacement = displacement;

			const targetSpeed = this.$scope.dados.settings[stateName][eventType].targetSpeed;

			const time = (displacement / targetSpeed) - this.$scope.operationData.operationContext.currentOperation.inSlips;

			const accelerationTimeLimit = this.$scope.dados.settings[stateName][eventType].targetAccelerationTimeLimit;
			const decelerationTimeLimit = this.$scope.dados.settings[stateName][eventType].targetDecelerationTimeLimit;

			const vcruising = this.vCruisingCalculator.calculate((displacement / time), time, accelerationTimeLimit, decelerationTimeLimit);

			this.$scope.dados.settings[stateName][eventType].vcruising = vcruising;

			this.$scope.dados.settings[stateName][eventType].targetTime = displacement / this.$scope.dados.settings[stateName][eventType].targetSpeed;
			this.$scope.dados.settings[stateName][eventType].optimumTime = displacement / this.$scope.dados.settings[stateName][eventType].optimumSpeed;
		} else {

			this.$scope.dados.settings[stateName][eventType].targetTime = 1 / this.$scope.dados.settings[stateName][eventType].targetSpeed;
			this.$scope.dados.settings[stateName][eventType].optimumTime = 1 / this.$scope.dados.settings[stateName][eventType].optimumSpeed;
		}

	}

	private actionButtonApply() {

		const eventData: any = {};

		eventData.stateKey = this.$scope.dados.selectedState;
		eventData.eventKey = this.$scope.dados.selectedEventType;

		eventData.voptimumPercentage = +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].targetSpeed / +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].optimumSpeed;
		eventData.accelerationTimeLimitPercentage = +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].targetAccelerationTimeLimit / +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].optimumAccelerationTimeLimit;
		eventData.decelerationTimeLimitPercentage = +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].targetDecelerationTimeLimit / +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].optimumDecelerationTimeLimit;
		eventData.safetySpeedLimitPercentage = +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].targetSafetySpeedLimit / +this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].optimumSafetySpeedLimit;
		eventData.stateType = this.$scope.dados.settings[this.$scope.dados.selectedState][this.$scope.dados.selectedEventType].stateType;

		this.operationDataFactory.emitUpdateContractParams(eventData);

	}

	private prepareTimeSlices(timeSlices) {

		let timeOrder = 1;

		for (const i in timeSlices) {
			const timeSlice = timeSlices[i];

			timeSlice.timeOrder = timeOrder;

			if (timeSlice.percentage > 0) {
				timeOrder++;
			} else {
				timeSlice.enabled = false;
				timeSlice.canDelete = true;
			}

			timeSlice.operation = {
				id: this.$scope.operationData.operationContext.currentOperation.id,
			};

		}

		return timeSlices;

	}

	private returnValidTimeSlices(timeSlice) {
		return timeSlice.percentage > 0;
	}

}
