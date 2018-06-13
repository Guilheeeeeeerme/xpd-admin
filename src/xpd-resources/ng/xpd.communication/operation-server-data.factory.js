(function() {
	'use strict';

	if (typeof window === 'undefined') {

		module.exports = operationDataFactory;
	
	} else {

		angular.module('xpd.communication')
			.factory('operationDataFactory', operationDataFactory);

		operationDataFactory.$inject = ['operationCommunicationFactory'];

	}
	
	function operationDataFactory(operationCommunicationFactory) {
		var dataHandler = new DataHandler(operationCommunicationFactory);
		return dataHandler;
	}

	// controlador de entrada e saida de dado no context
	function OperationData() {

		var vm = this;

		for (var i in OperationData.prototype.CONTEXTS) {
			var context = '_' + i;
			vm[context] = null;
			defineProperty(i, context);
		}

		function defineProperty(attr, context) {
			Object.defineProperty(
				OperationData.prototype,
				attr, {
					get: function() {

						if (this[context] == null)
							console.log('You are not listening to ' + context, new Error().stack);

						return this[context];
					},
					set: function(data) {
						this[context] = data;
					},
					enumerable: true,
					configurable: true
				}

			);
		}

	}

	function DataHandler(operationCommunicationFactory) {
		this._openCommunicationChannel = operationCommunicationFactory.openCommunicationChannel;
		this._operationData = null;
		this._eventsCallbacks = {};
	}

	DataHandler.prototype.initContextMapping = initContextMapping;
	DataHandler.prototype.addEventListener = addEventListener;

	DataHandler.prototype.CONTEXTS = OperationData.prototype.CONTEXTS = {
		onGoingFailureContext: 'onGoingFailure',
		wellContext: 'well',
		blockSpeedContext: 'blockSpeed',
		shiftContext: 'shift',
		operationContext: 'operation',
		timeSlicesContext: 'timeSlices',
		alarmContext: 'alarm',
		contractParamsContext: 'contractParams',
		stateContext: 'state',
		chronometerContext: 'chronometer',
		eventContext: 'event',
		parallelEventContext: 'parallelEvent',
		jointContext: 'jointLog',
		operationProgressContext: 'operationProgress',
		elevatorTargetContext: 'elevatorTarget',
		scoreContext: 'score',
		vtargetContext: 'vTarget',
		readingContext: 'reading',
		bitDepthContext: 'bitDepth',
		vreContext: 'vre',
		suboperationContext: 'subOperation',
		displacementContext: 'displacement',
		forecastContext: 'forecast',
		operationQueueContext: 'operationQueue',
		securityContext: 'speedSecurity',
		directionContext: 'direction',
		dataAcquisitionContext: 'dataAcquisition'
	};


	/**
     * Controlando o operationData
     */
	Object.defineProperty(DataHandler.prototype, 'operationData', {

		get: function() {

			if (!this._operationData || this.ready != true) {
				throw new Error('Please initialize before call addEventListener: <operationDataFactory>.operationData =  [threads...]');
			}

			return this._operationData;
		},

		set: function(threads) {

			/**
             *	Momento principal:
             **/
			if (this.ready == true) {
				console.info('There is already an running operation data factory.');
				return;
			} else {
				this.ready = true;
			}

			var getAll = false;

			if (!threads || threads.length == 0) {
				console.info('Usage <operationDataFactory>.operationData = [threads...] ');
				threads = [];
				getAll = true;
			} else {
				console.info(new Error().stack);
			}

			this._operationData = new OperationData();

			for (var i in DataHandler.prototype.CONTEXTS) {

				var context = DataHandler.prototype.CONTEXTS[i];

				if (getAll) {
					threads.push(context);
				}

				if (getAll || threads.indexOf(context) >= 0) {
					this._operationData[i] = {};
				}

			}

			var self = this;

			this._openCommunicationChannel('/operation', threads).then(function(response) {
				self.initContextMapping(response, self);
			});

		},
		enumerable: true,
		configurable: true
	});

	function addEventListener(origin, event, callback) {

		if (!this._operationData) {
			throw new Error('Please initialize before call addEventListener: <operationDataFactory>.operationData =  [threads...]');
		}

		if (!this._eventsCallbacks[event])
			this._eventsCallbacks[event] = {};

		this._eventsCallbacks[event][origin] = callback;

	}

	function initContextMapping(response, vm) {

		var communicationChannel = response;


		for (var key in communicationChannel) {
			if (key.startsWith('emit'))
				vm[key] = getEmitFunction(key);
		}
		
		
		
		/**
		 * ON GOING FAILURE
         */
		communicationChannel.setOnGoingFailureListener && communicationChannel.setOnGoingFailureListener(setOnGoingFailureListener);
		communicationChannel.setOnErrorInsertFailureListener && communicationChannel.setOnErrorInsertFailureListener(setOnErrorInsertFailureListener);
		communicationChannel.setOnErrorUpdateFailureListener && communicationChannel.setOnErrorUpdateFailureListener(setOnErrorUpdateFailureListener);
		communicationChannel.setOnLastOnGoingSavedListener && communicationChannel.setOnLastOnGoingSavedListener(setOnLastOnGoingSavedListener);

		function setOnGoingFailureListener(onGoingFailureContext) {
			loadContext('onGoingFailureContext', onGoingFailureContext);
			loadEventListenersCallback('setOnGoingFailureListener', onGoingFailureContext);
		}

		function setOnErrorInsertFailureListener(onGoingFailureContext) {
			loadContext('onGoingFailureContext', onGoingFailureContext);
			loadEventListenersCallback('setOnErrorInsertFailureListener', onGoingFailureContext);
		}

		function setOnErrorUpdateFailureListener(onGoingFailureContext){
			loadContext('onGoingFailureContext', onGoingFailureContext);
			loadEventListenersCallback('setOnErrorUpdateFailureListener', onGoingFailureContext);
		}

		function setOnLastOnGoingSavedListener(onGoingFailureContext) {
			loadContext('onGoingFailureContext', onGoingFailureContext);
			loadEventListenersCallback('setOnLastOnGoingSavedListener', onGoingFailureContext);
		}
		
		/**
         * WELL
         */
		communicationChannel.setOnWellChangeListener && communicationChannel.setOnWellChangeListener(setOnWellChangeListener);
		communicationChannel.setOnCurrentWellListener && communicationChannel.setOnCurrentWellListener(setOnCurrentWellListener);
		communicationChannel.setOnNoCurrentWellListener && communicationChannel.setOnNoCurrentWellListener(setOnNoCurrentWellListener);

		function setOnWellChangeListener(wellContext) {
			loadContext('wellContext', wellContext);
			loadEventListenersCallback('setOnWellChangeListener', wellContext);
		}

		function setOnCurrentWellListener(wellContext) {
			loadContext('wellContext', wellContext);
			loadEventListenersCallback('setOnCurrentWellListener', wellContext);
		}

		function setOnNoCurrentWellListener(wellContext) {
			loadContext('wellContext', wellContext);
			loadEventListenersCallback('setOnNoCurrentWellListener', wellContext);
		}

		/**
         * BLOCK SPEED
         */
		communicationChannel.setOnBlockSpeedChangeListener && communicationChannel.setOnBlockSpeedChangeListener(setOnBlockSpeedChangeListener);

		function setOnBlockSpeedChangeListener(blockSpeedContext) {
			loadContext('blockSpeedContext', blockSpeedContext);
			loadEventListenersCallback('setOnBlockSpeedChangeListener', blockSpeedContext);
		}

		/**
         * BLOCK SPEED
         */
		communicationChannel.setOnChronometerTickListener && communicationChannel.setOnChronometerTickListener(setOnChronometerTickListener);

		function setOnChronometerTickListener(chronometerContext) {
			loadContext('chronometerContext', chronometerContext);
			loadEventListenersCallback('setOnChronometerTickListener', chronometerContext);
		}

		/**
         * Operation Queue
         */
		communicationChannel.setOnOperationQueueChangeListener && communicationChannel.setOnOperationQueueChangeListener(setOnOperationQueueChangeListener);
		communicationChannel.setOnCurrentOperationQueueListener && communicationChannel.setOnCurrentOperationQueueListener(setOnCurrentOperationQueueListener);
		communicationChannel.setOnNoCurrentOperationQueueListener && communicationChannel.setOnNoCurrentOperationQueueListener(setOnNoCurrentOperationQueueListener);
		communicationChannel.setOnUnableToMakeCurrentListener && communicationChannel.setOnUnableToMakeCurrentListener(setOnUnableToMakeCurrentListener);

		function setOnOperationQueueChangeListener(operationQueueContext) {
			loadContext('operationQueueContext', operationQueueContext);
			loadEventListenersCallback('setOnOperationQueueChangeListener', operationQueueContext);
		}

		function setOnCurrentOperationQueueListener(operationQueueContext) {
			loadContext('operationQueueContext', operationQueueContext);
			loadEventListenersCallback('setOnCurrentOperationQueueListener', operationQueueContext);
		}

		function setOnNoCurrentOperationQueueListener(operationQueueContext) {
			loadContext('operationQueueContext', operationQueueContext);
			loadEventListenersCallback('setOnNoCurrentOperationQueueListener', operationQueueContext);
		}

		function setOnUnableToMakeCurrentListener(operationQueueContext) {
			loadContext('operationQueueContext', operationQueueContext);
			loadEventListenersCallback('setOnUnableToMakeCurrentListener', operationQueueContext);
		}

		/**
         * SHIFT
         */
		communicationChannel.setOnShiftListener && communicationChannel.setOnShiftListener(setOnShiftListener);

		function setOnShiftListener(shiftContext) {
			loadContext('shiftContext', shiftContext);
			loadEventListenersCallback('setOnShiftListener', shiftContext);
		}

		/**
         * OPERATION
         */
		communicationChannel.setOnOperationChangeListener && communicationChannel.setOnOperationChangeListener(setOnOperationChangeListener);
		communicationChannel.setOnCurrentOperationListener && communicationChannel.setOnCurrentOperationListener(setOnCurrentOperationListener);
		communicationChannel.setOnRunningOperationListener && communicationChannel.setOnRunningOperationListener(setOnRunningOperationListener);
		communicationChannel.setOnNoCurrentOperationListener && communicationChannel.setOnNoCurrentOperationListener(setOnNoCurrentOperationListener);
		communicationChannel.setOnChangeOperationOrderListener && communicationChannel.setOnChangeOperationOrderListener(setOnChangeOperationOrderListener);
		communicationChannel.setOnUpdateInSlipsListener && communicationChannel.setOnUpdateInSlipsListener(setOnUpdateInSlipsListener);
		communicationChannel.setOnUpdateSlipsThresholdListener && communicationChannel.setOnUpdateSlipsThresholdListener(setOnUpdateSlipsThresholdListener);
		communicationChannel.setOnCementingStatusUpdateListener && communicationChannel.setOnCementingStatusUpdateListener(setOnCementingStatusUpdateListener);

		function setOnOperationChangeListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnOperationChangeListener', operationContext);
		}

		function setOnCurrentOperationListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnCurrentOperationListener', operationContext);
		}

		function setOnRunningOperationListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnRunningOperationListener', operationContext);
		}

		function setOnNoCurrentOperationListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnNoCurrentOperationListener', operationContext);
		}

		function setOnChangeOperationOrderListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnChangeOperationOrderListener', operationContext);
		}

		function setOnUpdateInSlipsListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnUpdateInSlipsListener', operationContext);
		}

		function setOnUpdateSlipsThresholdListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnUpdateSlipsThresholdListener', operationContext);
		}

		function setOnCementingStatusUpdateListener(operationContext) {
			loadContext('operationContext', operationContext);
			loadEventListenersCallback('setOnCementingStatusUpdateListener', operationContext);
		}

		/**
         * TIME SLICE
         */
		communicationChannel.setOnTimeSlicesChangeListener && communicationChannel.setOnTimeSlicesChangeListener(setOnTimeSlicesChangeListener);
		communicationChannel.setOnTimeSlicesListener && communicationChannel.setOnTimeSlicesListener(setOnTimeSlicesListener);
		communicationChannel.setOnNoTimeSlicesListener && communicationChannel.setOnNoTimeSlicesListener(setOnNoTimeSlicesListener);

		function setOnTimeSlicesChangeListener(timeSlicesContext) {
			loadContext('timeSlicesContext', timeSlicesContext);
			loadEventListenersCallback('setOnTimeSlicesChangeListener', timeSlicesContext);
		}

		function setOnTimeSlicesListener(timeSlicesContext) {
			loadContext('timeSlicesContext', timeSlicesContext);
			loadEventListenersCallback('setOnTimeSlicesListener', timeSlicesContext);
		}

		function setOnNoTimeSlicesListener(timeSlicesContext) {
			loadContext('timeSlicesContext', timeSlicesContext);
			loadEventListenersCallback('setOnNoTimeSlicesListener', timeSlicesContext);
		}

		/**
         * ALARM
         */
		communicationChannel.setOnAlarmsChangeListener && communicationChannel.setOnAlarmsChangeListener(setOnAlarmsChangeListener);
		communicationChannel.setOnCurrentAlarmsListener && communicationChannel.setOnCurrentAlarmsListener(setOnCurrentAlarmsListener);
		communicationChannel.setOnNoCurrentAlarmsListener && communicationChannel.setOnNoCurrentAlarmsListener(setOnNoCurrentAlarmsListener);
		communicationChannel.setOnSpeedRestrictionAlarmListener && communicationChannel.setOnSpeedRestrictionAlarmListener(setOnSpeedRestrictionAlarmListener);
		communicationChannel.setOnDurationAlarmListener && communicationChannel.setOnDurationAlarmListener(setOnDurationAlarmListener);
		communicationChannel.setOnNoCurrentAlarmListener && communicationChannel.setOnNoCurrentAlarmListener(setOnNoCurrentAlarmListener);
		communicationChannel.setOnExpectedAlarmChangeListener && communicationChannel.setOnExpectedAlarmChangeListener(setOnExpectedAlarmChangeListener);

		function setOnAlarmsChangeListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnAlarmsChangeListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnCurrentAlarmsListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnCurrentAlarmsListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnNoCurrentAlarmsListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnNoCurrentAlarmsListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnSpeedRestrictionAlarmListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnSpeedRestrictionAlarmListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnDurationAlarmListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnDurationAlarmListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnNoCurrentAlarmListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnNoCurrentAlarmListener', alarmContext);
			//console.log(alarmContext);
		}

		function setOnExpectedAlarmChangeListener(alarmContext) {
			loadContext('alarmContext', alarmContext);
			loadEventListenersCallback('setOnExpectedAlarmChangeListener', alarmContext);
		}

		/**
         * CONTRACT PARAMS
         */
		communicationChannel.setOnContractParamsChangeListener && communicationChannel.setOnContractParamsChangeListener(setOnContractParamsChangeListener);
		communicationChannel.setOnContractParamsListener && communicationChannel.setOnContractParamsListener(setOnContractParamsListener);
		communicationChannel.setOnNoContractParamsListener && communicationChannel.setOnNoContractParamsListener(setOnNoContractParamsListener);

		function setOnContractParamsChangeListener(contractParamsContext) {
			loadContext('contractParamsContext', contractParamsContext);
			loadEventListenersCallback('setOnContractParamsChangeListener', contractParamsContext);
		}

		function setOnContractParamsListener(contractParamsContext) {
			loadContext('contractParamsContext', contractParamsContext);
			loadEventListenersCallback('setOnContractParamsListener', contractParamsContext);
		}

		function setOnNoContractParamsListener(contractParamsContext) {
			loadContext('contractParamsContext', contractParamsContext);
			loadEventListenersCallback('setOnNoContractParamsListener', contractParamsContext);
		}

		/**
         * STATE
         */
		communicationChannel.setOnStateChangeListener && communicationChannel.setOnStateChangeListener(setOnStateChangeListener);
		communicationChannel.setOnCurrentStateListener && communicationChannel.setOnCurrentStateListener(setOnCurrentStateListener);
		communicationChannel.setOnNoCurrentStateListener && communicationChannel.setOnNoCurrentStateListener(setOnNoCurrentStateListener);
		communicationChannel.setOnCurrentStatesListener && communicationChannel.setOnCurrentStatesListener(setOnCurrentStatesListener);
		communicationChannel.setOnNoCurrentStatesListener && communicationChannel.setOnNoCurrentStatesListener(setOnNoCurrentStatesListener);
		communicationChannel.setOnExpectedStateChangeListener && communicationChannel.setOnExpectedStateChangeListener(setOnExpectedStateChangeListener);
		communicationChannel.setOnChangeLaydownStatusListener && communicationChannel.setOnChangeLaydownStatusListener(setOnChangeLaydownStatusListener);

		function setOnStateChangeListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnStateChangeListener', stateContext);
		}

		function setOnCurrentStateListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnCurrentStateListener', stateContext);
		}

		function setOnNoCurrentStateListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnNoCurrentStateListener', stateContext);
		}

		function setOnCurrentStatesListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnCurrentStatesListener', stateContext);
		}

		function setOnNoCurrentStatesListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnNoCurrentStatesListener', stateContext);
		}

		function setOnExpectedStateChangeListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnExpectedStateChangeListener', stateContext);
		}

		function setOnChangeLaydownStatusListener(stateContext) {
			loadContext('stateContext', stateContext);
			loadEventListenersCallback('setOnChangeLaydownStatusListener', stateContext);
		}

		/**
         * JOINT
         */
		communicationChannel.setOnJointChangeListener && communicationChannel.setOnJointChangeListener(setOnJointChangeListener);
		communicationChannel.setOnCurrentJointListener && communicationChannel.setOnCurrentJointListener(setOnCurrentJointListener);
		communicationChannel.setOnNoCurrentJointListener && communicationChannel.setOnNoCurrentJointListener(setOnNoCurrentJointListener);

		function setOnJointChangeListener(jointContext) {
			loadContext('jointContext', jointContext);
			loadEventListenersCallback('setOnJointChangeListener', jointContext);
		}

		function setOnCurrentJointListener(jointContext) {
			loadContext('jointContext', jointContext);
			loadEventListenersCallback('setOnCurrentJointListener', jointContext);
		}

		function setOnNoCurrentJointListener(jointContext) {
			loadContext('jointContext', jointContext);
			loadEventListenersCallback('setOnNoCurrentJointListener', jointContext);
		}



		/**
         * EVENT
         */
		communicationChannel.setOnParallelEventChangeListener && communicationChannel.setOnParallelEventChangeListener(setOnParallelEventChangeListener);

		function setOnParallelEventChangeListener(parallelEventContext) {
			loadContext('parallelEventContext', parallelEventContext);
			loadEventListenersCallback('setOnParallelEventChangeListener', parallelEventContext);
		}

		/**
         * EVENT
         */
		communicationChannel.setOnEventChangeListener && communicationChannel.setOnEventChangeListener(setOnEventChangeListener);
		communicationChannel.setOnCurrentEventListener && communicationChannel.setOnCurrentEventListener(setOnCurrentEventListener);
		communicationChannel.setOnNoCurrentEventListener && communicationChannel.setOnNoCurrentEventListener(setOnNoCurrentEventListener);
		communicationChannel.setOnEventLogUpdateListener && communicationChannel.setOnEventLogUpdateListener(setOnEventLogUpdateListener);
		communicationChannel.setOnWaitEventListener && communicationChannel.setOnWaitEventListener(setOnWaitEventListener);
		communicationChannel.setOnNoEventDetectedListener && communicationChannel.setOnNoEventDetectedListener(setOnNoEventDetectedListener);

		function setOnEventChangeListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnEventChangeListener', eventContext);
		}

		function setOnCurrentEventListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnCurrentEventListener', eventContext);
		}

		function setOnNoCurrentEventListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnNoCurrentEventListener', eventContext);
		}

		function setOnEventLogUpdateListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnEventLogUpdateListener', eventContext);
		}

		function setOnWaitEventListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnWaitEventListener', eventContext);
		}

		function setOnNoEventDetectedListener(eventContext) {
			loadContext('eventContext', eventContext);
			loadEventListenersCallback('setOnNoEventDetectedListener', eventContext);
		}

		/**
         * ELEVATOR TARGET
         */
		communicationChannel.setOnElevatorTargetStartListener && communicationChannel.setOnElevatorTargetStartListener(setOnElevatorTargetStartListener);
		communicationChannel.setOnElevatorTargetChangeListener && communicationChannel.setOnElevatorTargetChangeListener(setOnElevatorTargetChangeListener);
		communicationChannel.setOnElevatorTargetStopListener && communicationChannel.setOnElevatorTargetStopListener(setOnElevatorTargetStopListener);
		communicationChannel.setOnCurrentCalculatedListener && communicationChannel.setOnCurrentCalculatedListener(setOnCurrentCalculatedListener);
		communicationChannel.setOnTimeCalculatedListener && communicationChannel.setOnTimeCalculatedListener(setOnTimeCalculatedListener);

		function setOnElevatorTargetStartListener(elevatorTargetContext) {
			loadContext('elevatorTargetContext', elevatorTargetContext);
			loadEventListenersCallback('setOnElevatorTargetStartListener', elevatorTargetContext);
		}

		function setOnElevatorTargetChangeListener(elevatorTargetContext) {
			loadContext('elevatorTargetContext', elevatorTargetContext);
			loadEventListenersCallback('setOnElevatorTargetChangeListener', elevatorTargetContext);
		}

		function setOnElevatorTargetStopListener(elevatorTargetContext) {
			loadContext('elevatorTargetContext', elevatorTargetContext);
			loadEventListenersCallback('setOnElevatorTargetStopListener', elevatorTargetContext);
		}

		function setOnCurrentCalculatedListener(elevatorTargetContext) {
			loadContext('elevatorTargetContext', elevatorTargetContext);
			loadEventListenersCallback('setOnCurrentCalculatedListener', elevatorTargetContext);
		}

		function setOnTimeCalculatedListener(elevatorTargetContext) {
			loadContext('elevatorTargetContext', elevatorTargetContext);
			loadEventListenersCallback('setOnTimeCalculatedListener', elevatorTargetContext);
		}

		/**
         * SCORE
         */
		communicationChannel.setOnScoreUpdateListener && communicationChannel.setOnScoreUpdateListener(setOnScoreUpdateListener);
		communicationChannel.setOnScoreChangeListener && communicationChannel.setOnScoreChangeListener(setOnScoreChangeListener);
		communicationChannel.setOnInstantScoreUpdateListener && communicationChannel.setOnInstantScoreUpdateListener(setOnInstantScoreUpdateListener);

		function setOnScoreUpdateListener(scoreContext) {
			loadContext('scoreContext', scoreContext);
			loadEventListenersCallback('setOnScoreUpdateListener', scoreContext);
		}

		function setOnScoreChangeListener(scoreContext) {
			loadContext('scoreContext', scoreContext);
			loadEventListenersCallback('setOnScoreChangeListener', scoreContext);
		}

		function setOnInstantScoreUpdateListener(scoreContext) {
			loadContext('scoreContext', scoreContext);
			loadEventListenersCallback('setOnInstantScoreUpdateListener', scoreContext);
		}


		/**
         * VTARGET
         */
		communicationChannel.setOnVtargetsChangeListener && communicationChannel.setOnVtargetsChangeListener(setOnVtargetsChangeListener);
		communicationChannel.setOnInitVtargetListener && communicationChannel.setOnInitVtargetListener(setOnInitVtargetListener);
		communicationChannel.setOnNoVtargetListener && communicationChannel.setOnNoVtargetListener(setOnNoVtargetListener);
		communicationChannel.setOnOperationVtargetsReadyListener && communicationChannel.setOnOperationVtargetsReadyListener(setOnOperationVtargetsReadyListener);

		function setOnVtargetsChangeListener(vtargetContext) {
			loadContext('vtargetContext', vtargetContext);
			loadEventListenersCallback('setOnVtargetsChangeListener', vtargetContext);
		}

		function setOnInitVtargetListener(vtargetContext) {
			loadContext('vtargetContext', vtargetContext);
			loadEventListenersCallback('setOnInitVtargetListener', vtargetContext);
		}

		function setOnNoVtargetListener(vtargetContext) {
			loadContext('vtargetContext', vtargetContext);
			loadEventListenersCallback('setOnNoVtargetListener', vtargetContext);
		}

		function setOnOperationVtargetsReadyListener(vtargetContext) {
			loadContext('vtargetContext', vtargetContext);
			loadEventListenersCallback('setOnOperationVtargetsReadyListener', vtargetContext);
		}

		/**
         * READING
         */
		communicationChannel.setOnReadingChangeListener && communicationChannel.setOnReadingChangeListener(setOnReadingChangeListener);
		communicationChannel.setOnCurrentReadingListener && communicationChannel.setOnCurrentReadingListener(setOnCurrentReadingListener);
		communicationChannel.setOnReadingStateChangeListener && communicationChannel.setOnReadingStateChangeListener(setOnReadingStateChangeListener);
		// communicationChannel.setOnRigBitDepthListener && communicationChannel.setOnRigBitDepthListener(setOnRigBitDepthListener);

		function setOnCurrentReadingListener(readingContext) {
			loadContext('readingContext', readingContext);
			loadEventListenersCallback('setOnCurrentReadingListener', readingContext);
		}

		function setOnReadingChangeListener(readingContext) {
			loadContext('readingContext', readingContext);
			loadEventListenersCallback('setOnReadingChangeListener', readingContext);
		}

		function setOnReadingStateChangeListener(readingContext) {
			loadContext('readingContext', readingContext);
			loadEventListenersCallback('setOnReadingStateChangeListener', readingContext);
		}

		// function setOnRigBitDepthListener(readingContext) {
		// 	loadContext('readingContext', readingContext);
		// 	loadEventListenersCallback('setOnRigBitDepthListener', readingContext);
		// }

		/**
         * SUBOPERATION
         */
		communicationChannel.setOnSuboperationChangeListener && communicationChannel.setOnSuboperationChangeListener(setOnSuboperationChangeListener);
		communicationChannel.setOnCurrentSuboperationListener && communicationChannel.setOnCurrentSuboperationListener(setOnCurrentSuboperationListener);
		communicationChannel.setOnNoCurrentSuboperationListener && communicationChannel.setOnNoCurrentSuboperationListener(setOnNoCurrentSuboperationListener);

		function setOnSuboperationChangeListener(suboperationContext) {
			loadContext('suboperationContext', suboperationContext);
			loadEventListenersCallback('setOnSuboperationChangeListener', suboperationContext);
		}

		function setOnCurrentSuboperationListener(suboperationContext) {
			loadContext('suboperationContext', suboperationContext);
			loadEventListenersCallback('setOnCurrentSuboperationListener', suboperationContext);
		}

		function setOnNoCurrentSuboperationListener(suboperationContext) {
			loadContext('suboperationContext', suboperationContext);
			loadEventListenersCallback('setOnNoCurrentSuboperationListener', suboperationContext);
		}

		/**
         * DISPLACEMENT
         */
		communicationChannel.setOnDisplacementChangeListener && communicationChannel.setOnDisplacementChangeListener(setOnDisplacementChangeListener);

		function setOnDisplacementChangeListener(displacementContext) {
			loadContext('displacementContext', displacementContext);
			loadEventListenersCallback('setOnDisplacementChangeListener', displacementContext);
		}

		/**
         * FORECAST
         */
		communicationChannel.setOnForecastChangeListener && communicationChannel.setOnForecastChangeListener(setOnForecastChangeListener);
		communicationChannel.setOnvTargetLineListener && communicationChannel.setOnvTargetLineListener(setOnvTargetLineListener);
		communicationChannel.setOnActualLineListener && communicationChannel.setOnActualLineListener(setOnActualLineListener);

		function setOnForecastChangeListener(forecastContext) {
			loadContext('forecastContext', forecastContext);
			loadEventListenersCallback('setOnForecastChangeListener', forecastContext);
		}

		function setOnvTargetLineListener(forecastContext) {
			loadContext('forecastContext', forecastContext);
			loadEventListenersCallback('setOnvTargetLineListener', forecastContext);
		}

		function setOnActualLineListener(forecastContext) {
			loadContext('forecastContext', forecastContext);
			loadEventListenersCallback('setOnActualLineListener', forecastContext);
		}

		/**
         * VRE
         */
		communicationChannel.setOnVreDataChangeListener && communicationChannel.setOnVreDataChangeListener(setOnVreDataChangeListener);

		function setOnVreDataChangeListener(vreContext) {
			loadContext('vreContext', vreContext);
			loadEventListenersCallback('setOnVreDataChangeListener', vreContext);
		}

		/**
         * BIT DEPTH
         */
		communicationChannel.setOnBitDepthChangeListener && communicationChannel.setOnBitDepthChangeListener(setOnBitDepthChangeListener);
		communicationChannel.setOnXpdBitDepthChangeListener && communicationChannel.setOnXpdBitDepthChangeListener(setOnXpdBitDepthChangeListener);
		communicationChannel.setOnXpdBitDepthListener && communicationChannel.setOnXpdBitDepthListener(setOnXpdBitDepthListener);
		communicationChannel.setOnBitDepthModeChangeListener && communicationChannel.setOnBitDepthModeChangeListener(setOnBitDepthModeChangeListener);

		function setOnBitDepthChangeListener(bitDepthContext) {
			loadContext('bitDepthContext', bitDepthContext);
			loadEventListenersCallback('setOnBitDepthChangeListener', bitDepthContext);
		}

		function setOnXpdBitDepthChangeListener(bitDepthContext) {
			loadContext('bitDepthContext', bitDepthContext);
			loadEventListenersCallback('setOnXpdBitDepthChangeListener', bitDepthContext);
		}

		function setOnXpdBitDepthListener(bitDepthContext) {
			loadContext('bitDepthContext', bitDepthContext);
			loadEventListenersCallback('setOnXpdBitDepthListener', bitDepthContext);
		}

		function setOnBitDepthModeChangeListener(bitDepthContext) {
			loadContext('bitDepthContext', bitDepthContext);
			loadEventListenersCallback('setOnBitDepthModeChangeListener', bitDepthContext);
		}

		/**
         * SECURITY
         */
		communicationChannel.setOnSecurityChangeListener && communicationChannel.setOnSecurityChangeListener(setOnSecurityChangeListener);
		communicationChannel.setOnAboveSpeedLimitListener && communicationChannel.setOnAboveSpeedLimitListener(setOnAboveSpeedLimitListener);
		communicationChannel.setOnUnreachableTargetListener && communicationChannel.setOnUnreachableTargetListener(setOnUnreachableTargetListener);
		communicationChannel.setOnNoUnreachableTargetListener && communicationChannel.setOnNoUnreachableTargetListener(setOnNoUnreachableTargetListener);
		communicationChannel.setOnDelayUnreachableChangeListener && communicationChannel.setOnDelayUnreachableChangeListener(setOnDelayUnreachableChangeListener);

		function setOnSecurityChangeListener(securityContext) {
			loadContext('securityContext', securityContext);
			loadEventListenersCallback('setOnSecurityChangeListener', securityContext);
		}

		function setOnAboveSpeedLimitListener(securityContext) {
			loadContext('securityContext', securityContext);
			loadEventListenersCallback('setOnAboveSpeedLimitListener', securityContext);
		}

		function setOnUnreachableTargetListener(securityContext) {
			loadContext('securityContext', securityContext);
			loadEventListenersCallback('setOnUnreachableTargetListener', securityContext);
		}

		function setOnNoUnreachableTargetListener(securityContext) {
			loadContext('securityContext', securityContext);
			loadEventListenersCallback('setOnNoUnreachableTargetListener', securityContext);
		}

		function setOnDelayUnreachableChangeListener(securityContext) {
			loadContext('securityContext', securityContext);
			loadEventListenersCallback('setOnDelayUnreachableChangeListener', securityContext);
		}

		/**
         * OPERATION PROGRESS
         */
		communicationChannel.setOnCurrentOperationProgressUpdateListener && communicationChannel.setOnCurrentOperationProgressUpdateListener(setOnCurrentOperationProgressUpdateListener);
		communicationChannel.setOnCurrentOperationProgressDelayUpdateListener && communicationChannel.setOnCurrentOperationProgressDelayUpdateListener(setOnCurrentOperationProgressDelayUpdateListener);

		function setOnCurrentOperationProgressUpdateListener(operationProgressContext) {
			loadContext('operationProgressContext', operationProgressContext);
			loadEventListenersCallback('setOnCurrentOperationProgressUpdateListener', operationProgressContext);
		}

		function setOnCurrentOperationProgressDelayUpdateListener(operationProgressContext) {
			loadContext('operationProgressContext', operationProgressContext);
			loadEventListenersCallback('setOnCurrentOperationProgressDelayUpdateListener', operationProgressContext);
		}

		/**
         * DIRECTION
         */
		communicationChannel.setOnDirectionDetectedListener && communicationChannel.setOnDirectionDetectedListener(setOnDirectionDetectedListener);

		function setOnDirectionDetectedListener(directionContext) {
			loadContext('directionContext', directionContext);
			loadEventListenersCallback('setOnDirectionDetectedListener', directionContext);
		}

		/**
         * DATA ACQUISITION
         */
		communicationChannel.setOnDataAcquisitionStartListener && communicationChannel.setOnDataAcquisitionStartListener(setOnDataAcquisitionStartListener);
		communicationChannel.setOnDataAcquisitionStopListener && communicationChannel.setOnDataAcquisitionStopListener(setOnDataAcquisitionStopListener);
		communicationChannel.setOnDataAcquisitionSuccessListener && communicationChannel.setOnDataAcquisitionSuccessListener(setOnDataAcquisitionSuccessListener);
		communicationChannel.setOnDataAcquisitionFailListener && communicationChannel.setOnDataAcquisitionFailListener(setOnDataAcquisitionFailListener);
		communicationChannel.setOnDataAcquisitionBlockSpeedIntervalChangeListener && communicationChannel.setOnDataAcquisitionBlockSpeedIntervalChangeListener(setOnDataAcquisitionBlockSpeedIntervalChangeListener);
		communicationChannel.setOnDataAcquisitionInDelayListener && communicationChannel.setOnDataAcquisitionInDelayListener(setOnDataAcquisitionInDelayListener);

		function setOnDataAcquisitionStartListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionStartListener', dataAcquisitionContext);
		}

		function setOnDataAcquisitionStopListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionStopListener', dataAcquisitionContext);
		}

		function setOnDataAcquisitionSuccessListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionSuccessListener', dataAcquisitionContext);
		}

		function setOnDataAcquisitionFailListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionFailListener', dataAcquisitionContext);
		}

		function setOnDataAcquisitionBlockSpeedIntervalChangeListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionBlockSpeedIntervalChangeListener', dataAcquisitionContext);
		}

		function setOnDataAcquisitionInDelayListener(dataAcquisitionContext) {
			loadContext('dataAcquisitionContext', dataAcquisitionContext);
			loadEventListenersCallback('setOnDataAcquisitionInDelayListener', dataAcquisitionContext);
		}


		function loadEventListenersCallback(listenerName, data) {
			for (var i in vm._eventsCallbacks[listenerName]) {
				vm._eventsCallbacks[listenerName][i](data);
			}
		}

		function getEmitFunction(channelKey) {
			return function(data) {
				communicationChannel[channelKey](data);
			};
		}

		function loadContext(target, context) {

			if (!vm._operationData[target]) {
				console.warn('Contexto nÃƒÂ£o esperado', target, new Error().stack);
				vm._operationData[target] = {};
			}

			for (var i in context) {
				vm._operationData[target][i] = context[i];
			}
		}

	}

})();