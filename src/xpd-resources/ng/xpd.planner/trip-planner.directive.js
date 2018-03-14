(function () {

	angular.module('xpd.planner')
		.directive('xpdTripPlanner', xpdTripPlanner);

	xpdTripPlanner.$inject = ['vCruisingCalculator'];

	function xpdTripPlanner(vCruisingCalculator) {
		return {
			link: link,
			scope: {
				label: '@',
				targetSpeed: '=',
				targetTime: '=',
				optimumSpeed: '<',
				displacement: '<',
				optimumSafetySpeedLimit: '<',
				targetSafetySpeedLimit: '=',
				vcruising: '=',

				optimumAccelerationTimeLimit: '<',
				targetAccelerationTimeLimit: '=',
				optimumDecelerationTimeLimit: '<',
				targetDecelerationTimeLimit: '=',

				stickUp: '<',
				upperStop: '<',
				slipsTime: '=',
				inSlipsDefault: '<',

				currentOperation: '=',

				actionButtonApply: '&'
			},
			templateUrl: '../xpd-resources/ng/xpd.planner/trip-planner.template.html'
		};

		function link(scope, elem, attrs) {

			scope.$watch('targetSpeed', updateTargetTime, true);
			scope.$watchGroup([
				'slipsTime', 
				'targetAccelerationTimeLimit', 
				'targetDecelerationTimeLimit', 
				'targetSpeed', 
				'displacement'
			], updateSettings, true);

			function updateTargetTime() {
				var reference = scope.displacement;

				scope.targetTime = reference / +scope.targetSpeed;
				scope.optimumTime = reference / +scope.optimumSpeed;
			}

			function updateSettings() {
							
				scope.slipsTime = Math.floor(scope.slipsTime);
				scope.targetAccelerationTimeLimit = Math.floor(scope.targetAccelerationTimeLimit);
				scope.targetDecelerationTimeLimit = Math.floor(scope.targetDecelerationTimeLimit);
			
				var displacement = scope.displacement;
			
				var targetSpeed = scope.targetSpeed;
			
				var pureDuration = (displacement / targetSpeed);
				var time = pureDuration - scope.slipsTime;
			
				var accelerationTimeLimit = scope.targetAccelerationTimeLimit;
				var decelerationTimeLimit = scope.targetDecelerationTimeLimit;
			
				var vcruising = vCruisingCalculator.calculate((displacement / time), time, accelerationTimeLimit, decelerationTimeLimit);
			
				scope.vcruising = vcruising;
			}

		}
	}

})();