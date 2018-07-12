(function() {

	angular.module('xpd.planner')
		.directive('xpdConnectionPlanner', xpdConnectionPlanner);

	function xpdConnectionPlanner() {
		return {
			link,
			scope: {
				label: '@',
				targetSpeed: '=',
				targetTime: '=',
				timeSlices: '<',
				optimumSpeed: '<',
				actionButtonApply: '&',
			},
			templateUrl: '../xpd-resources/ng/xpd.planner/connection-planner.template.html',
		};

		function link(scope, elem, attrs) {

			let stopWatchingPlannerTimeSlices;

			scope.actionSwap = actionSwap;
			scope.actionButtonAddTimeSlice = actionButtonAddTimeSlice;
			scope.changingPercentageOf = changingPercentageOf;
			scope.makeMoveVtarget = makeMoveVtarget;

			function changingPercentageOf(item) {
				scope.selectedSlice = item;
				// onTimeSlicesPercentageChange();

			}

			function makeMoveVtarget(item, list) {
				list.map(function(_item) {

					if (item.timeOrder == _item.timeOrder) {
						_item.moveVtarget = _item.moveVtarget;
					} else {
						_item.moveVtarget = false;
					}

					return _item;
				});
			}

			scope.$watch('targetSpeed', updateTargetTime, true);

			function actionSwap(indexA, valueA, indexB, valueB) {

				stopWatchingPlannerTimeSlices && stopWatchingPlannerTimeSlices();

				if (valueA && valueB) {
					scope.timeSlices[scope.selectedDirection][indexA] = angular.copy(valueB);
					scope.timeSlices[scope.selectedDirection][indexB] = angular.copy(valueA);
				}

				stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();
			}

			function updateTargetTime() {

				let reference = 1;

				scope.targetTime = reference / scope.targetSpeed;
				scope.optimumTime = reference / scope.optimumSpeed;
			}

			stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();

			function actionButtonAddTimeSlice(timeSlices, direction, name) {

				stopWatchingPlannerTimeSlices && stopWatchingPlannerTimeSlices();

				timeSlices[direction].push({
					id: null,
					name,
					percentage: 0,
					timeOrder: timeSlices[direction].length + 1,
					tripin: direction != 'tripout',
					moveVtarget: false,
					canDelete: true,
				});

				stopWatchingPlannerTimeSlices = startWatchingPlannerTimeSlices();

			}

			function startWatchingPlannerTimeSlices() {
				return scope.$watch('timeSlices', onTimeSlicesPercentageChange, true);
			}

			function onTimeSlicesPercentageChange() {

				let timeSlices = scope.timeSlices;

				let direction = scope.selectedDirection;

				if (!timeSlices || !direction) {
					return;
	}

				timeSlices = timeSlices[direction];

				scope.leftPercentage = 100;

				let timeOrder = 1;
				let timeSlice = null;

				for (let i in timeSlices) {

					timeSlice = timeSlices[i];

					timeSlice.timeOrder = timeOrder;

					timeSlice.percentage = Math.round(timeSlice.percentage);
					scope.leftPercentage -= timeSlice.percentage;

					timeOrder++;
				}

				if (scope.leftPercentage < 0) {
					scope.selectedSlice.percentage += scope.leftPercentage;
				}

			}

		}
	}

})();
