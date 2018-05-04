import { start } from "repl";

(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', '$interval', '$q', 'readingSetupAPIService'];

	function DMecLogController($scope, $interval, $q, readingSetupAPIService) {

		var ONE_HOUR = 3600000;
		var ONE_DAY = 24 * ONE_HOUR;
		var updateLatency = 1000;
		var getTickInterval;

		setTimeout(function () {
			location.reload();
		}, (ONE_HOUR / 2) );

		$scope.zoomIsLocked = false;
		$scope.actionButtonSubmitDmecRange = actionButtonSubmitDmecRange;
		$scope.isZooming = isZooming;
		
		initializeComponent();

		function initializeComponent() {
			
			var endAt = new Date().getTime();
			var intervalToShow = 0;
			var inputRangeForm = $scope.inputRangeForm = getInputRangeForm();

			if (inputRangeForm.realtime) {
				intervalToShow = (+inputRangeForm.last * +inputRangeForm.toMilliseconds);
				$scope.dmecTrackingStartAt = getAllReadingSince(new Date(endAt - intervalToShow));
			} else {
				$scope.dmecTrackingStartAt = getAllReadingSince(new Date(inputRangeForm.startTime));
			}

			intervalToShow = endAt - new Date($scope.dmecTrackingStartAt).getTime();
			$scope.dmecTrackingEndAt = new Date(endAt);
			$scope.zoomEndAt = new Date(endAt);
			$scope.zoomStartAt = new Date(endAt - (intervalToShow / 2));

			if (angular.isDefined(getTickInterval)) {
				$interval.cancel(getTickInterval);
				getTickInterval = undefined;
			}

			getTickInterval = $interval(getTick, updateLatency);

		}

		function isZooming(lockZoom){
			$scope.zoomIsLocked = lockZoom;
		}

		function moveZoomRealtime() {
						
			var now = new Date();
			var zoom = new Date($scope.zoomEndAt).getTime() - new Date($scope.zoomStartAt).getTime();

			$scope.zoomStartAt = new Date(now.getTime() - zoom);
			$scope.zoomEndAt = now;
		}

		function actionButtonSubmitDmecRange() {			
			localStorage.setItem('dmecInputRangeForm', JSON.stringify($scope.inputRangeForm));
			location.reload();
		}

		function getTick() {
			
			if ($scope.inputRangeForm.realtime) {

				var now = new Date().getTime();
				$scope.dmecTrackingEndAt = now;

				if($scope.inputRangeForm.keepZoomAtTheEnd){
					
					if(!$scope.zoomIsLocked){
						moveZoomRealtime();
					}
				}

				$scope.onReading = $q(function (resolve, reject) {
					readingSetupAPIService.getTick((now - updateLatency), resolve, reject);
				});

			}

		}

		function getAllReadingSince(startTime) {
			
			startTime = new Date(startTime);
			var endTime = new Date(startTime);
			endTime.setHours(startTime.getHours() + 12);

			// var currentTime = new Date().getTime();

			var promiseList = [];

			// while (endTime < currentTime) {
			// 	endTime = new Date(startTime.getHours() + 12);

			// 	if(endTime.getTime() > currentTime)
			// 		endTime = currentTime;

				promiseList.push($q(function (resolve, reject) {
					readingSetupAPIService.getAllReadingByStartEndTime(startTime.getTime(), endTime.getTime(), resolve, reject);
				}));

				// startTime = new Date(endTime);
			// }

			// $q.all(promiseList).then(function (results) {
			// 	console.log(results);
			// })

			/**
			 * TODO: fazer quantas requisições de 12 em 12 horas forem necessárias de agora até AGORA
			 */
			/**
			 * Reading since vai virar um Promise.all (VER COMO É ISSO COM O $q)
			 */
			$scope.onReadingSince = $q(function (resolve, reject) {

				/**
				 * TODO: adicionar o parametro TO
				 */
				readingSetupAPIService.getAllReadingSince(startTime.getTime(), resolve, reject);
			});

			/**
			 * Exemplo
			 * 
			 * var promiseList = [];
			 * 
			 * while(startTime < endTime){
			 * 		promiseList.push( $q(funciton (){ ....... from, to, .....) )
			 *      startTime += 12 horas
			 * }
			 * 
			 * Promise.all(promiseList).then(function(results){
			 * 	$scope.onReadingSince = mergeResults(results)
			 * });
			 */

			return startTime;
		}

		function getInputRangeForm() {
			
			var inputRangeForm;

			try {
				inputRangeForm = JSON.parse(localStorage.getItem('dmecInputRangeForm'));
			} catch (e) {
				inputRangeForm = null;
			}

			if (!inputRangeForm) {
				inputRangeForm = {
					realtime: true,
					last: 30,
					toMilliseconds: '60000',
				};
			}

			if (inputRangeForm && inputRangeForm.startTime) {
				inputRangeForm.startTime = new Date(inputRangeForm.startTime);
			}

			return inputRangeForm;
		}

	}

})();

