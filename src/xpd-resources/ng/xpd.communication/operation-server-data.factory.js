(function () {
	'use strict';

	if (typeof window === 'undefined') {

		module.exports = operationDataFactory;

	} else {

		angular.module('xpd.communication')
			.factory('operationDataFactory', operationDataFactory);

		operationDataFactory.$inject = ['$q', 'socketFactory', 'xpdAccessFactory'];

	}

	function operationDataFactory($q, socketFactory, xpdAccessFactory) {

		var socket;
		var communicationChannel = null;
		var threadList = [
			'failure',
			'well',
			'blockSpeed',
			'shift',
			'operation',
			'timeSlices',
			'alarm',
			'state',
			'chronometer',
			'event',
			'parallelEvent',
			'jointLog',
			'operationProgress',
			'elevatorTarget',
			'score',
			'vTarget',
			'reading',
			'bitDepth',
			'vre',
			'subOperation',
			'forecast',
			'operationQueue',
			'speedSecurity',
			'direction',
			'dataAcquisition'
		];

		var operationDataFactory = {
			operationData: {},
			eventsCallbacks: {},
			addEventListener: addEventListener
		};

		return {
			openConnection: openConnection,
			addEventListener: addEventListener
		};

		function openConnection(threads) {
			var self = this;

			if (!threads || threads.length == 0) {
				threads = threadList;
			}

			return $q(function (resolve, reject) {

				if (communicationChannel) {
					console.info('There is already an running operation data factory.');
					resolve(operationDataFactory);
				} else {
					communicationChannel = {};

					socket = socketFactory(xpdAccessFactory.getOperationServerURL(), '/operation-socket', threads);

					socket.on('subjects', function (response) {

						var ContextSubjects = response.ContextSubjects;
						var UserActions = response.UserActions;

						contextSubjectGenerator(ContextSubjects, communicationChannel);

						userActionsGenerator(UserActions, communicationChannel);

						for (var key in communicationChannel) {
							if (key.startsWith('emit')) {
								operationDataFactory[key] = getEmitFunction(key);
							}
						}

						function getEmitFunction(channelKey) {
							return function (data) {
								communicationChannel[channelKey](data);
							};
						}

						resolve(operationDataFactory);

					});
				}

			});
		}

		function contextSubjectGenerator(ContextSubjects, communicationChannel) {
			for (var i in ContextSubjects) {

				var contextSubject = ContextSubjects[i];

				var subject = contextSubject.toLowerCase();

				subject = subject.replace(/_./g, function (v) {
					return v.toUpperCase().replace(/_/g, '');
				});

				subject = 'set' + subject.charAt(0).toUpperCase() + subject.slice(1) + 'Listener';

				communicationChannel[subject] = setOn(socket, contextSubject);
				setInterceptor(subject, communicationChannel[subject]);
			}
		}

		function userActionsGenerator(UserActions, communicationChannel) {
			for (var i in UserActions) {

				var userAction = UserActions[i];

				var action = userAction.toLowerCase();

				action = action.replace(/_./g, function (v) {
					return v.toUpperCase().replace(/_/g, '');
				});

				action = 'emit' + action.charAt(0).toUpperCase() + action.slice(1);

				communicationChannel[action] = setEmit(socket, userAction);
			}
		}

		function setInterceptor(subject, communication) {
			communication(function (contextRoot) {
				if (contextRoot && contextRoot.name && contextRoot.data) {
					var contextName = contextRoot.name;
					var contextData = contextRoot.data;

					loadContext(contextName, contextData);
					loadEventListenersCallback(subject, contextData);
				}
			});
		}

		function loadContext(target, context) {

			if (!operationDataFactory.operationData[target]) {
				// console.warn('Contexto não esperado', target, new Error().stack);
				operationDataFactory.operationData[target] = {};
			}

			for (var i in context) {
				operationDataFactory.operationData[target][i] = context[i];
			}
		}

		function loadEventListenersCallback(listenerName, data) {

			for (var origin in operationDataFactory.eventsCallbacks[listenerName]) {
				try {
					operationDataFactory.eventsCallbacks[listenerName][origin](data);
				} catch (e) {
					console.error(e);
				}
			}

		}

		function setOn(socket, eventName) {
			return function (callback) {
				socket.on(eventName, callback);
			};
		}

		function setEmit(socket, eventName) {
			return function (data) {
				socket.emit(eventName, data);
			};
		}

		function addEventListener(origin, event, callback) {

			if (!operationDataFactory.eventsCallbacks[event])
				operationDataFactory.eventsCallbacks[event] = {};

			operationDataFactory.eventsCallbacks[event][origin] = callback;
		}

	}

	// function initContextMapping(response, vm) {

	// var communicationChannel = response;

	// for (var key in communicationChannel) {
	// 	if (key.startsWith('emit'))
	// 		vm[key] = getEmitFunction(key);
	// }		

	// function getEmitFunction(channelKey) {
	// 	return function (data) {
	// 		communicationChannel[channelKey](data);
	// 	};
	// }

	// /**
	//  * FAILURE
	//  */
	// communicationChannel.setOnFailureChangeListener && communicationChannel.setOnFailureChangeListener(setOnFailureChangeListener);
	// communicationChannel.setOnErrorUpsertFailureListener && communicationChannel.setOnErrorUpsertFailureListener(setOnErrorUpsertFailureListener);

	// communicationChannel.setOnGoingFailureListener && communicationChannel.setOnGoingFailureListener(setOnGoingFailureListener);
	// communicationChannel.setOnNoGoingFailureListener && communicationChannel.setOnNoGoingFailureListener(setOnNoGoingFailureListener);
	// communicationChannel.setOnLastOnGoingSavedListener && communicationChannel.setOnLastOnGoingSavedListener(setOnLastOnGoingSavedListener);

	// function setOnFailureChangeListener(failureContext) {
	// 	loadContext('failureContext', failureContext);
	// 	loadEventListenersCallback('setOnFailureChangeListener', failureContext);
	// }

	// function setOnErrorUpsertFailureListener(failureContext) {
	// 	loadContext('failureContext', failureContext);
	// 	loadEventListenersCallback('setOnErrorUpsertFailureListener', failureContext);
	// }

	// function setOnGoingFailureListener(failureContext) {
	// 	loadContext('failureContext', failureContext);
	// 	loadEventListenersCallback('setOnGoingFailureListener', failureContext);
	// }

	// function setOnNoGoingFailureListener(failureContext) {
	// 	loadContext('failureContext', failureContext);
	// 	loadEventListenersCallback('setOnNoGoingFailureListener', failureContext);
	// }		

	// function setOnLastOnGoingSavedListener(failureContext) {
	// 	loadContext('failureContext', failureContext);
	// 	loadEventListenersCallback('setOnLastOnGoingSavedListener', failureContext);
	// }

	// /**
	//  * WELL
	//  */
	// communicationChannel.setOnWellChangeListener && communicationChannel.setOnWellChangeListener(setOnWellChangeListener);
	// communicationChannel.setOnCurrentWellListener && communicationChannel.setOnCurrentWellListener(setOnCurrentWellListener);
	// communicationChannel.setOnNoCurrentWellListener && communicationChannel.setOnNoCurrentWellListener(setOnNoCurrentWellListener);

	// function setOnWellChangeListener(wellContext) {
	// 	loadContext('wellContext', wellContext);
	// 	loadEventListenersCallback('setOnWellChangeListener', wellContext);
	// }

	// function setOnCurrentWellListener(wellContext) {
	// 	loadContext('wellContext', wellContext);
	// 	loadEventListenersCallback('setOnCurrentWellListener', wellContext);
	// }

	// function setOnNoCurrentWellListener(wellContext) {
	// 	loadContext('wellContext', wellContext);
	// 	loadEventListenersCallback('setOnNoCurrentWellListener', wellContext);
	// }

	// /**
	//  * BLOCK SPEED
	//  */
	// communicationChannel.setOnBlockSpeedChangeListener && communicationChannel.setOnBlockSpeedChangeListener(setOnBlockSpeedChangeListener);

	// function setOnBlockSpeedChangeListener(blockSpeedContext) {
	// 	loadContext('blockSpeedContext', blockSpeedContext);
	// 	loadEventListenersCallback('setOnBlockSpeedChangeListener', blockSpeedContext);
	// }

	// /**
	//  * BLOCK SPEED
	//  */
	// communicationChannel.setOnChronometerTickListener && communicationChannel.setOnChronometerTickListener(setOnChronometerTickListener);

	// function setOnChronometerTickListener(chronometerContext) {
	// 	loadContext('chronometerContext', chronometerContext);
	// 	loadEventListenersCallback('setOnChronometerTickListener', chronometerContext);
	// }

	// /**
	//  * Operation Queue
	//  */
	// communicationChannel.setOnOperationQueueChangeListener && communicationChannel.setOnOperationQueueChangeListener(setOnOperationQueueChangeListener);
	// communicationChannel.setOnCurrentOperationQueueListener && communicationChannel.setOnCurrentOperationQueueListener(setOnCurrentOperationQueueListener);
	// communicationChannel.setOnNoCurrentOperationQueueListener && communicationChannel.setOnNoCurrentOperationQueueListener(setOnNoCurrentOperationQueueListener);
	// communicationChannel.setOnUnableToMakeCurrentListener && communicationChannel.setOnUnableToMakeCurrentListener(setOnUnableToMakeCurrentListener);

	// function setOnOperationQueueChangeListener(operationQueueContext) {
	// 	loadContext('operationQueueContext', operationQueueContext);
	// 	loadEventListenersCallback('setOnOperationQueueChangeListener', operationQueueContext);
	// }

	// function setOnCurrentOperationQueueListener(operationQueueContext) {
	// 	loadContext('operationQueueContext', operationQueueContext);
	// 	loadEventListenersCallback('setOnCurrentOperationQueueListener', operationQueueContext);
	// }

	// function setOnNoCurrentOperationQueueListener(operationQueueContext) {
	// 	loadContext('operationQueueContext', operationQueueContext);
	// 	loadEventListenersCallback('setOnNoCurrentOperationQueueListener', operationQueueContext);
	// }

	// function setOnUnableToMakeCurrentListener(operationQueueContext) {
	// 	loadContext('operationQueueContext', operationQueueContext);
	// 	loadEventListenersCallback('setOnUnableToMakeCurrentListener', operationQueueContext);
	// }

	// /**
	//  * SHIFT
	//  */
	// communicationChannel.setOnShiftListener && communicationChannel.setOnShiftListener(setOnShiftListener);

	// function setOnShiftListener(shiftContext) {
	// 	loadContext('shiftContext', shiftContext);
	// 	loadEventListenersCallback('setOnShiftListener', shiftContext);
	// }

	// /**
	//  * OPERATION
	//  */
	// communicationChannel.setOnOperationChangeListener && communicationChannel.setOnOperationChangeListener(setOnOperationChangeListener);
	// communicationChannel.setOnCurrentOperationListener && communicationChannel.setOnCurrentOperationListener(setOnCurrentOperationListener);
	// communicationChannel.setOnRunningOperationListener && communicationChannel.setOnRunningOperationListener(setOnRunningOperationListener);
	// communicationChannel.setOnNoCurrentOperationListener && communicationChannel.setOnNoCurrentOperationListener(setOnNoCurrentOperationListener);
	// communicationChannel.setOnChangeOperationOrderListener && communicationChannel.setOnChangeOperationOrderListener(setOnChangeOperationOrderListener);
	// communicationChannel.setOnUpdateInSlipsListener && communicationChannel.setOnUpdateInSlipsListener(setOnUpdateInSlipsListener);
	// communicationChannel.setOnUpdateSlipsThresholdListener && communicationChannel.setOnUpdateSlipsThresholdListener(setOnUpdateSlipsThresholdListener);
	// communicationChannel.setOnCementingStatusUpdateListener && communicationChannel.setOnCementingStatusUpdateListener(setOnCementingStatusUpdateListener);

	// function setOnOperationChangeListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnOperationChangeListener', operationContext);
	// }

	// function setOnCurrentOperationListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnCurrentOperationListener', operationContext);
	// }

	// function setOnRunningOperationListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnRunningOperationListener', operationContext);
	// }

	// function setOnNoCurrentOperationListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnNoCurrentOperationListener', operationContext);
	// }

	// function setOnChangeOperationOrderListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnChangeOperationOrderListener', operationContext);
	// }

	// function setOnUpdateInSlipsListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnUpdateInSlipsListener', operationContext);
	// }

	// function setOnUpdateSlipsThresholdListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnUpdateSlipsThresholdListener', operationContext);
	// }

	// function setOnCementingStatusUpdateListener(operationContext) {
	// 	loadContext('operationContext', operationContext);
	// 	loadEventListenersCallback('setOnCementingStatusUpdateListener', operationContext);
	// }

	// /**
	//  * TIME SLICE
	//  */
	// communicationChannel.setOnTimeSlicesChangeListener && communicationChannel.setOnTimeSlicesChangeListener(setOnTimeSlicesChangeListener);
	// communicationChannel.setOnTimeSlicesListener && communicationChannel.setOnTimeSlicesListener(setOnTimeSlicesListener);
	// communicationChannel.setOnNoTimeSlicesListener && communicationChannel.setOnNoTimeSlicesListener(setOnNoTimeSlicesListener);

	// function setOnTimeSlicesChangeListener(timeSlicesContext) {
	// 	loadContext('timeSlicesContext', timeSlicesContext);
	// 	loadEventListenersCallback('setOnTimeSlicesChangeListener', timeSlicesContext);
	// }

	// function setOnTimeSlicesListener(timeSlicesContext) {
	// 	loadContext('timeSlicesContext', timeSlicesContext);
	// 	loadEventListenersCallback('setOnTimeSlicesListener', timeSlicesContext);
	// }

	// function setOnNoTimeSlicesListener(timeSlicesContext) {
	// 	loadContext('timeSlicesContext', timeSlicesContext);
	// 	loadEventListenersCallback('setOnNoTimeSlicesListener', timeSlicesContext);
	// }

	// /**
	//  * ALARM
	//  */
	// communicationChannel.setOnAlarmsChangeListener && communicationChannel.setOnAlarmsChangeListener(setOnAlarmsChangeListener);
	// communicationChannel.setOnCurrentAlarmsListener && communicationChannel.setOnCurrentAlarmsListener(setOnCurrentAlarmsListener);
	// communicationChannel.setOnNoCurrentAlarmsListener && communicationChannel.setOnNoCurrentAlarmsListener(setOnNoCurrentAlarmsListener);
	// communicationChannel.setOnSpeedRestrictionAlarmListener && communicationChannel.setOnSpeedRestrictionAlarmListener(setOnSpeedRestrictionAlarmListener);
	// communicationChannel.setOnDurationAlarmListener && communicationChannel.setOnDurationAlarmListener(setOnDurationAlarmListener);
	// communicationChannel.setOnNoCurrentAlarmListener && communicationChannel.setOnNoCurrentAlarmListener(setOnNoCurrentAlarmListener);
	// communicationChannel.setOnExpectedAlarmChangeListener && communicationChannel.setOnExpectedAlarmChangeListener(setOnExpectedAlarmChangeListener);

	// function setOnAlarmsChangeListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnAlarmsChangeListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnCurrentAlarmsListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnCurrentAlarmsListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnNoCurrentAlarmsListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnNoCurrentAlarmsListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnSpeedRestrictionAlarmListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnSpeedRestrictionAlarmListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnDurationAlarmListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnDurationAlarmListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnNoCurrentAlarmListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnNoCurrentAlarmListener', alarmContext);
	// 	//console.log(alarmContext);
	// }

	// function setOnExpectedAlarmChangeListener(alarmContext) {
	// 	loadContext('alarmContext', alarmContext);
	// 	loadEventListenersCallback('setOnExpectedAlarmChangeListener', alarmContext);
	// }

	// /**
	//  * CONTRACT PARAMS
	//  */
	// communicationChannel.setOnContractParamsChangeListener && communicationChannel.setOnContractParamsChangeListener(setOnContractParamsChangeListener);
	// communicationChannel.setOnContractParamsListener && communicationChannel.setOnContractParamsListener(setOnContractParamsListener);
	// communicationChannel.setOnNoContractParamsListener && communicationChannel.setOnNoContractParamsListener(setOnNoContractParamsListener);

	// function setOnContractParamsChangeListener(contractParamsContext) {
	// 	loadContext('contractParamsContext', contractParamsContext);
	// 	loadEventListenersCallback('setOnContractParamsChangeListener', contractParamsContext);
	// }

	// function setOnContractParamsListener(contractParamsContext) {
	// 	loadContext('contractParamsContext', contractParamsContext);
	// 	loadEventListenersCallback('setOnContractParamsListener', contractParamsContext);
	// }

	// function setOnNoContractParamsListener(contractParamsContext) {
	// 	loadContext('contractParamsContext', contractParamsContext);
	// 	loadEventListenersCallback('setOnNoContractParamsListener', contractParamsContext);
	// }

	// /**
	//  * STATE
	//  */
	// communicationChannel.setOnStateChangeListener && communicationChannel.setOnStateChangeListener(setOnStateChangeListener);
	// communicationChannel.setOnCurrentStateListener && communicationChannel.setOnCurrentStateListener(setOnCurrentStateListener);
	// communicationChannel.setOnNoCurrentStateListener && communicationChannel.setOnNoCurrentStateListener(setOnNoCurrentStateListener);
	// communicationChannel.setOnCurrentStatesListener && communicationChannel.setOnCurrentStatesListener(setOnCurrentStatesListener);
	// communicationChannel.setOnNoCurrentStatesListener && communicationChannel.setOnNoCurrentStatesListener(setOnNoCurrentStatesListener);
	// communicationChannel.setOnExpectedStateChangeListener && communicationChannel.setOnExpectedStateChangeListener(setOnExpectedStateChangeListener);
	// communicationChannel.setOnChangeLaydownStatusListener && communicationChannel.setOnChangeLaydownStatusListener(setOnChangeLaydownStatusListener);

	// function setOnStateChangeListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnStateChangeListener', stateContext);
	// }

	// function setOnCurrentStateListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnCurrentStateListener', stateContext);
	// }

	// function setOnNoCurrentStateListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnNoCurrentStateListener', stateContext);
	// }

	// function setOnCurrentStatesListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnCurrentStatesListener', stateContext);
	// }

	// function setOnNoCurrentStatesListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnNoCurrentStatesListener', stateContext);
	// }

	// function setOnExpectedStateChangeListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnExpectedStateChangeListener', stateContext);
	// }

	// function setOnChangeLaydownStatusListener(stateContext) {
	// 	loadContext('stateContext', stateContext);
	// 	loadEventListenersCallback('setOnChangeLaydownStatusListener', stateContext);
	// }

	// /**
	//  * JOINT
	//  */
	// communicationChannel.setOnJointChangeListener && communicationChannel.setOnJointChangeListener(setOnJointChangeListener);
	// communicationChannel.setOnCurrentJointListener && communicationChannel.setOnCurrentJointListener(setOnCurrentJointListener);
	// communicationChannel.setOnNoCurrentJointListener && communicationChannel.setOnNoCurrentJointListener(setOnNoCurrentJointListener);

	// function setOnJointChangeListener(jointContext) {
	// 	loadContext('jointContext', jointContext);
	// 	loadEventListenersCallback('setOnJointChangeListener', jointContext);
	// }

	// function setOnCurrentJointListener(jointContext) {
	// 	loadContext('jointContext', jointContext);
	// 	loadEventListenersCallback('setOnCurrentJointListener', jointContext);
	// }

	// function setOnNoCurrentJointListener(jointContext) {
	// 	loadContext('jointContext', jointContext);
	// 	loadEventListenersCallback('setOnNoCurrentJointListener', jointContext);
	// }



	// /**
	//  * EVENT
	//  */
	// communicationChannel.setOnParallelEventChangeListener && communicationChannel.setOnParallelEventChangeListener(setOnParallelEventChangeListener);

	// function setOnParallelEventChangeListener(parallelEventContext) {
	// 	loadContext('parallelEventContext', parallelEventContext);
	// 	loadEventListenersCallback('setOnParallelEventChangeListener', parallelEventContext);
	// }

	// /**
	//  * EVENT
	//  */
	// communicationChannel.setOnEventChangeListener && communicationChannel.setOnEventChangeListener(setOnEventChangeListener);
	// communicationChannel.setOnCurrentEventListener && communicationChannel.setOnCurrentEventListener(setOnCurrentEventListener);
	// communicationChannel.setOnNoCurrentEventListener && communicationChannel.setOnNoCurrentEventListener(setOnNoCurrentEventListener);
	// communicationChannel.setOnEventLogUpdateListener && communicationChannel.setOnEventLogUpdateListener(setOnEventLogUpdateListener);
	// communicationChannel.setOnWaitEventListener && communicationChannel.setOnWaitEventListener(setOnWaitEventListener);
	// communicationChannel.setOnNoEventDetectedListener && communicationChannel.setOnNoEventDetectedListener(setOnNoEventDetectedListener);

	// function setOnEventChangeListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnEventChangeListener', eventContext);
	// }

	// function setOnCurrentEventListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnCurrentEventListener', eventContext);
	// }

	// function setOnNoCurrentEventListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnNoCurrentEventListener', eventContext);
	// }

	// function setOnEventLogUpdateListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnEventLogUpdateListener', eventContext);
	// }

	// function setOnWaitEventListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnWaitEventListener', eventContext);
	// }

	// function setOnNoEventDetectedListener(eventContext) {
	// 	loadContext('eventContext', eventContext);
	// 	loadEventListenersCallback('setOnNoEventDetectedListener', eventContext);
	// }

	// /**
	//  * ELEVATOR TARGET
	//  */
	// communicationChannel.setOnElevatorTargetStartListener && communicationChannel.setOnElevatorTargetStartListener(setOnElevatorTargetStartListener);
	// communicationChannel.setOnElevatorTargetChangeListener && communicationChannel.setOnElevatorTargetChangeListener(setOnElevatorTargetChangeListener);
	// communicationChannel.setOnElevatorTargetStopListener && communicationChannel.setOnElevatorTargetStopListener(setOnElevatorTargetStopListener);
	// communicationChannel.setOnCurrentCalculatedListener && communicationChannel.setOnCurrentCalculatedListener(setOnCurrentCalculatedListener);
	// communicationChannel.setOnTimeCalculatedListener && communicationChannel.setOnTimeCalculatedListener(setOnTimeCalculatedListener);

	// function setOnElevatorTargetStartListener(elevatorTargetContext) {
	// 	loadContext('elevatorTargetContext', elevatorTargetContext);
	// 	loadEventListenersCallback('setOnElevatorTargetStartListener', elevatorTargetContext);
	// }

	// function setOnElevatorTargetChangeListener(elevatorTargetContext) {
	// 	loadContext('elevatorTargetContext', elevatorTargetContext);
	// 	loadEventListenersCallback('setOnElevatorTargetChangeListener', elevatorTargetContext);
	// }

	// function setOnElevatorTargetStopListener(elevatorTargetContext) {
	// 	loadContext('elevatorTargetContext', elevatorTargetContext);
	// 	loadEventListenersCallback('setOnElevatorTargetStopListener', elevatorTargetContext);
	// }

	// function setOnCurrentCalculatedListener(elevatorTargetContext) {
	// 	loadContext('elevatorTargetContext', elevatorTargetContext);
	// 	loadEventListenersCallback('setOnCurrentCalculatedListener', elevatorTargetContext);
	// }

	// function setOnTimeCalculatedListener(elevatorTargetContext) {
	// 	loadContext('elevatorTargetContext', elevatorTargetContext);
	// 	loadEventListenersCallback('setOnTimeCalculatedListener', elevatorTargetContext);
	// }

	// /**
	//  * SCORE
	//  */
	// communicationChannel.setOnScoreUpdateListener && communicationChannel.setOnScoreUpdateListener(setOnScoreUpdateListener);
	// communicationChannel.setOnScoreChangeListener && communicationChannel.setOnScoreChangeListener(setOnScoreChangeListener);
	// communicationChannel.setOnInstantScoreUpdateListener && communicationChannel.setOnInstantScoreUpdateListener(setOnInstantScoreUpdateListener);

	// function setOnScoreUpdateListener(scoreContext) {
	// 	loadContext('scoreContext', scoreContext);
	// 	loadEventListenersCallback('setOnScoreUpdateListener', scoreContext);
	// }

	// function setOnScoreChangeListener(scoreContext) {
	// 	loadContext('scoreContext', scoreContext);
	// 	loadEventListenersCallback('setOnScoreChangeListener', scoreContext);
	// }

	// function setOnInstantScoreUpdateListener(scoreContext) {
	// 	loadContext('scoreContext', scoreContext);
	// 	loadEventListenersCallback('setOnInstantScoreUpdateListener', scoreContext);
	// }


	// /**
	//  * VTARGET
	//  */
	// communicationChannel.setOnVtargetsChangeListener && communicationChannel.setOnVtargetsChangeListener(setOnVtargetsChangeListener);
	// communicationChannel.setOnInitVtargetListener && communicationChannel.setOnInitVtargetListener(setOnInitVtargetListener);
	// communicationChannel.setOnNoVtargetListener && communicationChannel.setOnNoVtargetListener(setOnNoVtargetListener);
	// communicationChannel.setOnOperationVtargetsReadyListener && communicationChannel.setOnOperationVtargetsReadyListener(setOnOperationVtargetsReadyListener);

	// function setOnVtargetsChangeListener(vtargetContext) {
	// 	loadContext('vtargetContext', vtargetContext);
	// 	loadEventListenersCallback('setOnVtargetsChangeListener', vtargetContext);
	// }

	// function setOnInitVtargetListener(vtargetContext) {
	// 	loadContext('vtargetContext', vtargetContext);
	// 	loadEventListenersCallback('setOnInitVtargetListener', vtargetContext);
	// }

	// function setOnNoVtargetListener(vtargetContext) {
	// 	loadContext('vtargetContext', vtargetContext);
	// 	loadEventListenersCallback('setOnNoVtargetListener', vtargetContext);
	// }

	// function setOnOperationVtargetsReadyListener(vtargetContext) {
	// 	loadContext('vtargetContext', vtargetContext);
	// 	loadEventListenersCallback('setOnOperationVtargetsReadyListener', vtargetContext);
	// }

	// /**
	//  * READING
	//  */
	// communicationChannel.setOnReadingChangeListener && communicationChannel.setOnReadingChangeListener(setOnReadingChangeListener);
	// communicationChannel.setOnCurrentReadingListener && communicationChannel.setOnCurrentReadingListener(setOnCurrentReadingListener);
	// communicationChannel.setOnReadingStateChangeListener && communicationChannel.setOnReadingStateChangeListener(setOnReadingStateChangeListener);
	// // communicationChannel.setOnRigBitDepthListener && communicationChannel.setOnRigBitDepthListener(setOnRigBitDepthListener);

	// function setOnCurrentReadingListener(readingContext) {
	// 	loadContext('readingContext', readingContext);
	// 	loadEventListenersCallback('setOnCurrentReadingListener', readingContext);
	// }

	// function setOnReadingChangeListener(readingContext) {
	// 	loadContext('readingContext', readingContext);
	// 	loadEventListenersCallback('setOnReadingChangeListener', readingContext);
	// }

	// function setOnReadingStateChangeListener(readingContext) {
	// 	loadContext('readingContext', readingContext);
	// 	loadEventListenersCallback('setOnReadingStateChangeListener', readingContext);
	// }

	// // function setOnRigBitDepthListener(readingContext) {
	// // 	loadContext('readingContext', readingContext);
	// // 	loadEventListenersCallback('setOnRigBitDepthListener', readingContext);
	// // }

	// /**
	//  * SUBOPERATION
	//  */
	// communicationChannel.setOnSuboperationChangeListener && communicationChannel.setOnSuboperationChangeListener(setOnSuboperationChangeListener);
	// communicationChannel.setOnCurrentSuboperationListener && communicationChannel.setOnCurrentSuboperationListener(setOnCurrentSuboperationListener);
	// communicationChannel.setOnNoCurrentSuboperationListener && communicationChannel.setOnNoCurrentSuboperationListener(setOnNoCurrentSuboperationListener);

	// function setOnSuboperationChangeListener(suboperationContext) {
	// 	loadContext('suboperationContext', suboperationContext);
	// 	loadEventListenersCallback('setOnSuboperationChangeListener', suboperationContext);
	// }

	// function setOnCurrentSuboperationListener(suboperationContext) {
	// 	loadContext('suboperationContext', suboperationContext);
	// 	loadEventListenersCallback('setOnCurrentSuboperationListener', suboperationContext);
	// }

	// function setOnNoCurrentSuboperationListener(suboperationContext) {
	// 	loadContext('suboperationContext', suboperationContext);
	// 	loadEventListenersCallback('setOnNoCurrentSuboperationListener', suboperationContext);
	// }

	// /**
	//  * DISPLACEMENT
	//  */
	// communicationChannel.setOnDisplacementChangeListener && communicationChannel.setOnDisplacementChangeListener(setOnDisplacementChangeListener);

	// function setOnDisplacementChangeListener(displacementContext) {
	// 	loadContext('displacementContext', displacementContext);
	// 	loadEventListenersCallback('setOnDisplacementChangeListener', displacementContext);
	// }

	// /**
	//  * FORECAST
	//  */
	// communicationChannel.setOnForecastChangeListener && communicationChannel.setOnForecastChangeListener(setOnForecastChangeListener);
	// communicationChannel.setOnvTargetLineListener && communicationChannel.setOnvTargetLineListener(setOnvTargetLineListener);
	// communicationChannel.setOnActualLineListener && communicationChannel.setOnActualLineListener(setOnActualLineListener);

	// function setOnForecastChangeListener(forecastContext) {
	// 	loadContext('forecastContext', forecastContext);
	// 	loadEventListenersCallback('setOnForecastChangeListener', forecastContext);
	// }

	// function setOnvTargetLineListener(forecastContext) {
	// 	loadContext('forecastContext', forecastContext);
	// 	loadEventListenersCallback('setOnvTargetLineListener', forecastContext);
	// }

	// function setOnActualLineListener(forecastContext) {
	// 	loadContext('forecastContext', forecastContext);
	// 	loadEventListenersCallback('setOnActualLineListener', forecastContext);
	// }

	/**
	 * VRE
	 */
	// communicationChannel.setOnVreDataChangeListener && communicationChannel.setOnVreDataChangeListener(setOnVreDataChangeListener);

	// function setOnVreDataChangeListener(vreContext) {
	// 	loadContext('vreContext', vreContext);
	// 	loadEventListenersCallback('setOnVreDataChangeListener', vreContext);
	// }

	// /**
	//  * BIT DEPTH
	//  */
	// communicationChannel.setOnBitDepthChangeListener && communicationChannel.setOnBitDepthChangeListener(setOnBitDepthChangeListener);
	// communicationChannel.setOnXpdBitDepthChangeListener && communicationChannel.setOnXpdBitDepthChangeListener(setOnXpdBitDepthChangeListener);
	// communicationChannel.setOnXpdBitDepthListener && communicationChannel.setOnXpdBitDepthListener(setOnXpdBitDepthListener);
	// communicationChannel.setOnBitDepthModeChangeListener && communicationChannel.setOnBitDepthModeChangeListener(setOnBitDepthModeChangeListener);

	// function setOnBitDepthChangeListener(bitDepthContext) {
	// 	loadContext('bitDepthContext', bitDepthContext);
	// 	loadEventListenersCallback('setOnBitDepthChangeListener', bitDepthContext);
	// }

	// function setOnXpdBitDepthChangeListener(bitDepthContext) {
	// 	loadContext('bitDepthContext', bitDepthContext);
	// 	loadEventListenersCallback('setOnXpdBitDepthChangeListener', bitDepthContext);
	// }

	// function setOnXpdBitDepthListener(bitDepthContext) {
	// 	loadContext('bitDepthContext', bitDepthContext);
	// 	loadEventListenersCallback('setOnXpdBitDepthListener', bitDepthContext);
	// }

	// function setOnBitDepthModeChangeListener(bitDepthContext) {
	// 	loadContext('bitDepthContext', bitDepthContext);
	// 	loadEventListenersCallback('setOnBitDepthModeChangeListener', bitDepthContext);
	// }

	// /**
	//  * SECURITY
	//  */
	// communicationChannel.setOnSecurityChangeListener && communicationChannel.setOnSecurityChangeListener(setOnSecurityChangeListener);
	// communicationChannel.setOnAboveSpeedLimitListener && communicationChannel.setOnAboveSpeedLimitListener(setOnAboveSpeedLimitListener);
	// communicationChannel.setOnUnreachableTargetListener && communicationChannel.setOnUnreachableTargetListener(setOnUnreachableTargetListener);
	// communicationChannel.setOnNoUnreachableTargetListener && communicationChannel.setOnNoUnreachableTargetListener(setOnNoUnreachableTargetListener);
	// communicationChannel.setOnDelayUnreachableChangeListener && communicationChannel.setOnDelayUnreachableChangeListener(setOnDelayUnreachableChangeListener);

	// function setOnSecurityChangeListener(securityContext) {
	// 	loadContext('securityContext', securityContext);
	// 	loadEventListenersCallback('setOnSecurityChangeListener', securityContext);
	// }

	// function setOnAboveSpeedLimitListener(securityContext) {
	// 	loadContext('securityContext', securityContext);
	// 	loadEventListenersCallback('setOnAboveSpeedLimitListener', securityContext);
	// }

	// function setOnUnreachableTargetListener(securityContext) {
	// 	loadContext('securityContext', securityContext);
	// 	loadEventListenersCallback('setOnUnreachableTargetListener', securityContext);
	// }

	// function setOnNoUnreachableTargetListener(securityContext) {
	// 	loadContext('securityContext', securityContext);
	// 	loadEventListenersCallback('setOnNoUnreachableTargetListener', securityContext);
	// }

	// function setOnDelayUnreachableChangeListener(securityContext) {
	// 	loadContext('securityContext', securityContext);
	// 	loadEventListenersCallback('setOnDelayUnreachableChangeListener', securityContext);
	// }

	/**
	 * OPERATION PROGRESS
	 */
	// communicationChannel.setOnCurrentOperationProgressUpdateListener && communicationChannel.setOnCurrentOperationProgressUpdateListener(setOnCurrentOperationProgressUpdateListener);
	// communicationChannel.setOnCurrentOperationProgressDelayUpdateListener && communicationChannel.setOnCurrentOperationProgressDelayUpdateListener(setOnCurrentOperationProgressDelayUpdateListener);

	// function setOnCurrentOperationProgressUpdateListener(operationProgressContext) {
	// 	loadContext('operationProgressContext', operationProgressContext);
	// 	loadEventListenersCallback('setOnCurrentOperationProgressUpdateListener', operationProgressContext);
	// }

	// function setOnCurrentOperationProgressDelayUpdateListener(operationProgressContext) {
	// 	loadContext('operationProgressContext', operationProgressContext);
	// 	loadEventListenersCallback('setOnCurrentOperationProgressDelayUpdateListener', operationProgressContext);
	// }

	// /**
	//  * DIRECTION
	//  */
	// communicationChannel.setOnDirectionDetectedListener && communicationChannel.setOnDirectionDetectedListener(setOnDirectionDetectedListener);

	// function setOnDirectionDetectedListener(directionContext) {
	// 	loadContext('directionContext', directionContext);
	// 	loadEventListenersCallback('setOnDirectionDetectedListener', directionContext);
	// }

	// /**
	//  * DATA ACQUISITION
	//  */
	// communicationChannel.setOnDataAcquisitionStartListener && communicationChannel.setOnDataAcquisitionStartListener(setOnDataAcquisitionStartListener);
	// communicationChannel.setOnDataAcquisitionStopListener && communicationChannel.setOnDataAcquisitionStopListener(setOnDataAcquisitionStopListener);
	// communicationChannel.setOnDataAcquisitionSuccessListener && communicationChannel.setOnDataAcquisitionSuccessListener(setOnDataAcquisitionSuccessListener);
	// communicationChannel.setOnDataAcquisitionFailListener && communicationChannel.setOnDataAcquisitionFailListener(setOnDataAcquisitionFailListener);
	// communicationChannel.setOnDataAcquisitionBlockSpeedIntervalChangeListener && communicationChannel.setOnDataAcquisitionBlockSpeedIntervalChangeListener(setOnDataAcquisitionBlockSpeedIntervalChangeListener);
	// communicationChannel.setOnDataAcquisitionInDelayListener && communicationChannel.setOnDataAcquisitionInDelayListener(setOnDataAcquisitionInDelayListener);

	// function setOnDataAcquisitionStartListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionStartListener', dataAcquisitionContext);
	// }

	// function setOnDataAcquisitionStopListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionStopListener', dataAcquisitionContext);
	// }

	// function setOnDataAcquisitionSuccessListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionSuccessListener', dataAcquisitionContext);
	// }

	// function setOnDataAcquisitionFailListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionFailListener', dataAcquisitionContext);
	// }

	// function setOnDataAcquisitionBlockSpeedIntervalChangeListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionBlockSpeedIntervalChangeListener', dataAcquisitionContext);
	// }

	// function setOnDataAcquisitionInDelayListener(dataAcquisitionContext) {
	// 	loadContext('dataAcquisitionContext', dataAcquisitionContext);
	// 	loadEventListenersCallback('setOnDataAcquisitionInDelayListener', dataAcquisitionContext);
	// }

	// }

})();