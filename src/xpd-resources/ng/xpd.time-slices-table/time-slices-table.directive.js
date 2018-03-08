(function () {
	'use strict';

	angular.module('xpd.time-slices-table', [])
		.directive('timeSlicesTable', timeSlicesTable);

	timeSlicesTable.$inject = ['$filter'];

	function timeSlicesTable($filter) {
		return {
			restrict: 'E',
			scope: {
				name: '@',
				timeSliceForm: '=',
				disabled: '=',
				duration: '@',
				timeSlices: '=ngModel'
			},
			templateUrl: '../xpd-resources/ng/xpd.time-slices-table/time-slices-table.template.html',
			link: link
		};

		function link(scope, element, attrs) {

			var direction = scope.direction = (attrs.direction == 'tripout') ? 'tripout' : 'tripin';
			var lastDuration;

			scope.actionButtonAddTimeSlice = actionButtonAddTimeSlice;
			scope.actionButtonRemoveTimeSlice = actionButtonRemoveTimeSlice;
			scope.actionButtonSwap = actionButtonSwap;
			scope.actionChangePercentage = actionChangePercentage;
			scope.onDurationChange = onDurationChange;

			scope.$watch('duration', onDurationChange);

			refreshList();
			
			function actionButtonAddTimeSlice(newTask) {

				var timeSlices = getValidTimeSlices();
				
				if (timeSlices.length == 0)
					scope.remainingPercentage = 100;

				var timeSlice = {
					'name': newTask,
					'enabled': true
				};
				
				if (direction == 'tripout') {
					timeSlice.tripin = false;
				}else{
					timeSlice.tripin = true;
				}

				timeSlice.percentage = scope.remainingPercentage;
				timeSlice.duration = scope.remainingTime;

				scope.newTask = null;
				
				scope.timeSlices.push(timeSlice);

				// refreshList();
				calculateRemainingTime();

			}

			function actionButtonRemoveTimeSlice(timeSlice) {
				// if (timeSlice.id) {
				timeSlice.enabled = false;
				refreshList();
				// }
			}

			function actionButtonSwap(timeSlice1, timeSlice2) {
				if (timeSlice1 && timeSlice2) {
					var timeOrder = timeSlice1.timeOrder;
					timeSlice1.timeOrder = timeSlice2.timeOrder;
					timeSlice2.timeOrder = timeOrder;
					refreshList();
				}
			}

			function actionChangePercentage(timeSlice) {

				if (timeSlice.percentage == undefined || isNaN(timeSlice.percentage)) {
					timeSlice.percentage = (timeSlice.duration * 100) / scope.duration;
					return;
				}

				timeSlice.percentage = +timeSlice.percentage;

				refreshList();
				
				/**
				 * Evita que a soma das
				 * porcentagem das time slices
				 * passe de 100
				 */
				if (scope.duration == 0){
					timeSlice.percentage = 0;
					scope.remainingPercentage = 0;
					scope.remainingTime = 0;
				} else if (scope.remainingPercentage < 0) {
					timeSlice.percentage += scope.remainingPercentage;
					timeSlice.duration = calculateDurationTimeSlice(timeSlice);
					scope.remainingPercentage = 0;
					scope.remainingTime = 0;
				} else {
					timeSlice.duration = calculateDurationTimeSlice(timeSlice);
				}

				return timeSlice;

			}

			function refreshList() {

				if(! angular.isNumber( +scope.duration ))
					return;

				try {
					
					scope.timeSlices = scope.timeSlices.map(function (ts) {

						if (ts.enabled == false) {
							ts.enabled = false;
						} else {
							ts.enabled = true;
						} 
						
						if (direction == 'tripout') {
							ts.tripin = false;
						} else {
							ts.tripin = true;
						}

						return ts;

					});

				} catch (_ex) {
					scope.timeSlices = [];
				}

				lastDuration = +scope.duration;

				scope.timeSlices = scope.timeSlices.filter(function(ts){
					return !(!ts.id && !ts.enabled);
				});

				scope.timeSlices = $filter('orderBy')(scope.timeSlices, 'timeOrder') || [];
				
				calculateRemainingTime();

			}

			function getValidTimeSlices(){
				return $filter('orderBy')($filter('filter')(scope.timeSlices, { enabled: true }), 'timeOrder') || [];
			}

			function calculateRemainingTime() {

				var timeSlices = getValidTimeSlices();

				var acumulatedDuration = 0;
				var remainingPercentage = 100;

				var timeOrder = 0;

				for (var i in timeSlices) {
					var timeSlice = timeSlices[i];

					timeSlice.duration = calculateDurationTimeSlice(timeSlice);

					timeSlice.timeOrder = ++timeOrder;

					remainingPercentage -= +timeSlice.percentage;
					acumulatedDuration += timeSlice.duration;
				}

				scope.remainingPercentage = remainingPercentage;
				scope.remainingTime =  Math.abs(+scope.duration - acumulatedDuration);

			}

			function calculateDurationTimeSlice(timeSlice) {
				return scope.duration * (timeSlice.percentage / 100);
			}

			function onDurationChange(newDuration) {
				// Aqui o newDuration == scope.duration
				var timeSlices = getValidTimeSlices();

				if (!newDuration) return;

				if (timeSlices.length != 0) {

					if (isNaN(newDuration)){
						newDuration = 0;
						scope.duration = 0;
					}

					var totalDurationTimeSlices = getTotalDurationTimeSlices();
					
					if ( (+newDuration < totalDurationTimeSlices) && (+newDuration < lastDuration) ) {

						/**
						 * Troca a duração baseada na porcentagem
						 */
						timeSlices.map(function (ts) {
							actionChangePercentage(ts);
						});

					}

					if ((lastDuration != newDuration) || newDuration == 0) {

						/**
						 * Troca a porcentagem baseada na duração
						 */
						changePercentageTimeSlice(timeSlices);
						
						lastDuration = +newDuration;

					}
				} else {
					scope.remainingTime = +newDuration;
					lastDuration = +newDuration;
				}

				refreshList();
			}

			function getTotalDurationTimeSlices() {

				var timeSlices = getValidTimeSlices();
				var duration = 0;

				for (var i in timeSlices) {
					duration += timeSlices[i].duration;
				}

				return duration;

			}

			function changePercentageTimeSlice(timeSlices) {

				var acumulatedDuration = 0;

				for (var i in timeSlices) {

					var lastPercentage = timeSlices[i].percentage;

					if(scope.duration == 0)
						timeSlices[i].percentage = 0;
					else{
						timeSlices[i].percentage = (lastPercentage * lastDuration) / scope.duration;
						acumulatedDuration += timeSlices[i].duration;
					}

				}

				scope.remainingTime = +scope.duration - acumulatedDuration;
			}
		}

	}
	
})();