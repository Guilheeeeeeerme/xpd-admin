import * as angular from 'angular';
import { VCruisingCalculatorService } from '../../../shared/xpd.calculation/calculation.service';
import { DialogService } from '../../../shared/xpd.dialog/xpd.dialog.factory';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';

/*
* @Author:
* @Date:   2017-05-19 15:12:22
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-09-19 16:40:21
*/
export class PlannerController {

	public static $inject = ['$scope', '$filter', 'operationDataService', 'dialogService', 'vCruisingCalculator'];
	public operationDataFactory: any;
	public timeSlicesContext: any;
	public stateContext: any;
	public vtargetContext: any;

	constructor(
		public $scope,
		public $filter,
		public operationDataService: OperationDataService,
		public dialogService: DialogService,
		public vCruisingCalculator: VCruisingCalculatorService) {

		$scope.dados = {
			settings: null,
			timeSlices: null,
		};

		operationDataService.openConnection([]).then(() => {

			console.log('oi');

			this.operationDataFactory = operationDataService.operationDataFactory;
			$scope.operationData = this.operationDataFactory.operationData;

			this.startWatching();

			this.loadOperationStates();
			this.loadTimeSlice();
		});

	}

	private startWatching() {
		this.timeSlicesContext = this.$scope.$watch('operationData.timeSlicesContext', (data) => { this.loadTimeSlice(); }, true);
		this.stateContext = this.$scope.$watch('operationData.stateContext', (data) => { this.loadOperationStates(); }, true);
		this.vtargetContext = this.$scope.$watch('operationData.vtargetContext', (data) => { this.loadOperationStates(); }, true);
	}

	private stopWatching() {
		if (this.timeSlicesContext) { this.timeSlicesContext(); }
		if (this.stateContext) { this.stateContext(); }
		if (this.vtargetContext) { this.vtargetContext(); }
	}

	private loadTimeSlice() {

		if (!this.$scope.operationData.timeSlicesContext || !this.$scope.operationData.timeSlicesContext.timeSlices) {
			this.$scope.dados.timeSlices = null;
			return;
		}

		this.$scope.dados.timeSlices = angular.copy(this.$scope.operationData.timeSlicesContext.timeSlices);

	}

	private loadOperationStates() {

		if (!this.$scope.operationData.vtargetContext ||
			!this.$scope.operationData.stateContext ||
			!this.$scope.operationData.vtargetContext.vTargetPercentages ||
			!this.$scope.operationData.stateContext.operationStates) {

			this.$scope.dados.settings = null;
			return;
		}

		for (const i in this.$scope.operationData.stateContext.operationStates) {
			const stateName = i;
			const state = this.$scope.operationData.stateContext.operationStates[i];

			for (const j in state.calcVREParams) {
				const eventType = j;
				const param = state.calcVREParams[j];

				if (eventType !== 'TIME') {
					this.setAllActivitiesParams(stateName, state, eventType, param, state.stateType);
				}

			}
		}

	}

	private setAllActivitiesParams(stateName, state, eventType, params, stateType) {

		if (this.$scope.dados.settings == null) {
			this.$scope.dados.settings = {};
		}

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

	public actionSelectActivityToPlan(stateName, eventType) {

		this.stopWatching();

		this.$scope.dados.selectedEventType = null;

		this.$scope.dados.leftPercentage = 0;

		this.$scope.dados.selectedState = stateName;
		this.$scope.dados.selectedEventType = eventType;

	}

	public selectActivityOnInit(index, stateName, eventType) {
		if (index === 0) {
			this.actionSelectActivityToPlan(stateName, eventType);
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

	public sumTripConnduration(stateSettings) {

		const tripDuration = stateSettings.TRIP.targetTime * 1000;
		const connDuration = stateSettings.CONN.targetTime * 1000;

		return tripDuration + connDuration;
	}

	private returnValidTimeSlices(timeSlice) {
		return timeSlice.percentage > 0;
	}

}
