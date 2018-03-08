(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('DMecLogController', DMecLogController);

	DMecLogController.$inject = ['$scope', '$interval', 'readingSetupAPIService', '$uibModal'];

	function DMecLogController($scope, $interval, readingSetupAPIService, $modal) {

		var vm = this;

		vm.searchSince = searchSince;
		vm.openScaleModal = openScaleModal;

		var defaultTracks = [{
			label: 'BLOCK POSITION',
			min: -10,
			max: 50,
			unitMeasure: 'm',
			param: 'blockPosition',
			nextParam: true
		}, {
			label: 'RATE OF PENETRATION',
			min: 0,
			max: 100,
			unitMeasure: 'm/hr',
			param: 'rop',
			nextParam: false
		}, {
			label: 'WOB',
			min: -10,
			max: 40,
			unitMeasure: 'klbf',
			param: 'wob',
			nextParam: true
		}, {
			label: 'HOOKLOAD',
			min: -10,
			max: 500,
			unitMeasure: 'klbf',
			param: 'hookload',
			nextParam: false
		}, {
			label: 'RPM',
			min: -10,
			max: 200,
			unitMeasure: 'c/min',
			param: 'rpm',
			nextParam: true
		}, {
			label: 'TORQUE',
			min: 0,
			max: 5000,
			unitMeasure: 'kft.lbf',
			param: 'torque',
			nextParam: false
		}, {
			label: 'FLOW',
			min: 0,
			max: 1200,
			unitMeasure: 'gal/min',
			param: 'flow',
			nextParam: true
		}, {
			label: 'STANDPIPE PRESSURE',
			min: 0,
			max: 5000,
			unitMeasure: 'psi',
			param: 'sppa',
			nextParam: false
		}];

		if(!localStorage.dmecTracks){
			localStorage.dmecTracks = JSON.stringify(defaultTracks);
		}

		var tracks = JSON.parse(localStorage.dmecTracks);

		$interval(getTick, 1000);

		$scope.threshold = 3600000 * 0.5;

		setTimeout(function () {
			location.reload();
		}, $scope.threshold / 2);

		var maximumRange = new Date().getTime() - (1 * 24 * 3600000);
		maximumRange = new Date(maximumRange);

		maximumRange.setMilliseconds(0);
		maximumRange.setSeconds(0);

		$scope.dmecStartTime = $scope.dmecStartDate = maximumRange;

		searchSince();

		function setCurrentReading(currentReading) {

			$scope.currentReading = currentReading;

			if ($scope.tracks)
				$scope.tracks.map(preparePoints);

			function preparePoints(track) {

				if (!$scope.newPoints) {
					$scope.newPoints = {};
				}

				if (!$scope.newPoints[track.param]) {
					$scope.newPoints[track.param] = [];
				}

				$scope.newPoints[track.param].push({
					x: currentReading.timestamp,
					y: currentReading[track.param] || null,
					actual: currentReading[track.param] || null
				});

				$scope.newPoints[track.param] = $scope.newPoints[track.param];

				return track;
			}

		}

		function getTick() {
			if($scope.tracks){
				localStorage.dmecTracks = JSON.stringify($scope.tracks);
			}
			readingSetupAPIService.getTick(new Date().getTime(), setCurrentReading);
		}

		function searchSince() {

			$scope.tracks = null;

			$scope.progress = 0;

			var from = $scope.dmecStartDate;

			from.setHours($scope.dmecStartTime.getHours());
			from.setMinutes($scope.dmecStartTime.getMinutes());
			from.setSeconds($scope.dmecStartTime.getSeconds());
			from.setMilliseconds($scope.dmecStartTime.getMilliseconds());

			$scope.dmecStartDate = from;

			readingSetupAPIService.getAllReadingSince(from.getTime(), readingsFromDatabase);
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
				controller: 'ModalChangeScaleController',
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

