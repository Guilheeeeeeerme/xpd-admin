(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', '$interval', 'readingSetupAPIService'];

	function DMecLogController($scope, $interval, readingSetupAPIService) {

		var vm = this;
		var reloadTimeout = null;

		var day = (1 * 24 * 3600000);

		vm.actionButtonSearchSince = actionButtonSearchSince;

		var yesterday = new Date().getTime() - (1 * day);
		yesterday = new Date(yesterday);
		yesterday.setMilliseconds(0);
		yesterday.setSeconds(0);

		$scope.dmecStartTime = $scope.dmecStartDate = yesterday;

		searchSince(yesterday);

		function actionButtonSearchSince() {

			var from = $scope.dmecStartDate;

			from.setHours($scope.dmecStartTime.getHours());
			from.setMinutes($scope.dmecStartTime.getMinutes());
			from.setSeconds($scope.dmecStartTime.getSeconds());
			from.setMilliseconds($scope.dmecStartTime.getMilliseconds());

			$scope.dmecStartTime = $scope.dmecStartDate = from;

			searchSince(from);
		}

		function searchSince(startTime) {

			if(reloadTimeout){
				clearTimeout(reloadTimeout);
			}
			
			reloadTimeout = setTimeout(function () {
				location.reload();
			}, day / 2);

			$scope.dmecEndTime = new Date(startTime.getTime() + day / 2);

			readingSetupAPIService.getAllReadingSince(startTime.getTime(), readingsFromDatabase);
		}

		function readingsFromDatabase(readings) {
			$scope.readings = readings;
		}
	}

	function DMecLogControllerOld($scope, $interval, readingSetupAPIService, $modal) {

		var vm = this;
		vm.openScaleModal = openScaleModal;

		$interval(getTick, 1000);

		$scope.threshold = 3600000 * 0.5;

		searchSince();

		function getTick() {
			if ($scope.tracks) {
				localStorage.dmecTracks = JSON.stringify($scope.tracks);
			}
			readingSetupAPIService.getTick(new Date().getTime(), setCurrentReading);
		}

		function readingsFromDatabase(readings) {

			let newTracks = angular.copy(tracks);
			let oldPoints = {};

			newTracks = newTracks.map(preparePoints);

			function preparePoints(track) {

				oldPoints[track.param] = readings.map(convertToXY);

				function convertToXY(point) {
					return {
						x: point.timestamp,
						y: point[track.param] || null,
						actual: point[track.param] || null
					};
				}

				return track;
			}

			$scope.oldPoints = oldPoints;
			$scope.tracks = newTracks;
		}

		function openScaleModal() {
			$modal.open({
				animation: false,
				keyboard: false,
				backdrop: 'static',
				templateUrl: 'app/components/dmec-log/change-scale.template.html',
				controller: 'ModalUpdateDmecTracks',
				windowClass: 'change-scale-modal',
				resolve: {
					tracks: getTracks
				}
			});

			function getTracks() {
				return $scope.tracks;
			}
		}

	}

})();

