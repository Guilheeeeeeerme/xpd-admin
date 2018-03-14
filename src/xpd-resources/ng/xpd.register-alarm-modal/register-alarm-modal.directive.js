(function () {
	'use strict';

	angular.module('xpd.register-alarm-modal', [])
		.directive('registerAlarmModal', registerAlarmModal);
	
	registerAlarmModal.$inject = [];

	function registerAlarmModal() {
		return {
			restrict: 'E',
			scope: {
				alarm: '=',
				operation: '=',
				alarmType: '@',
				modalTitle: '@',
				alarmForm: '=',
				actionSaveAlarm: '=',
				actionCancelAlarm: '='
			},
			templateUrl: '../xpd-resources/ng/xpd.register-alarm-modal/register-alarm-modal.template.html',
			link: link
		};
		
		function link(scope, element, attrs) {

			scope.actionChangeDepth = actionChangeDepth;
			scope.$watch('alarm.isDurationAlarm', changeIsDurationAlarm );
			scope.$watch('alarm.startTime', takeSecondsAway, true);
			scope.$watch('alarm.endTime', takeSecondsAway, true);

			function changeIsDurationAlarm(){
				
				if (scope.alarm.isDurationAlarm == true){
					scope.alarm.endDepth = scope.alarm.startDepth;
				}

			}

			function actionChangeDepth() {

				if(scope.alarm.isDurationAlarm)
					scope.alarm.endDepth = scope.alarm.startDepth;

			}

			function takeSecondsAway(date){
				if(date && ( date.getSeconds() || date.getMilliseconds() )){
					date.setSeconds(null);
					date.setMilliseconds(null);
				}
			}

		}
		
	}
})();