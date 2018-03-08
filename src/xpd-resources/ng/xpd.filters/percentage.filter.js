(function () {
	'use strict';

	angular.module('xpd.filters')
		.filter('percentage', ['$filter', function ($filter) {
			return function (input, decimals) {
				return $filter('number')(input * 100, decimals) + '%';
			};
		}])

		.filter('secondsToHourMinutes', ['$filter', function ($filter) {
			return function (_seconds) {

				var startWith = '';

				if(_seconds < 0){
					startWith = '-';
					_seconds = Math.abs(_seconds);
				}

				// TODO durações negativas

				var milliseconds = Math.round(_seconds * 1000);

				var hours = Math.floor(milliseconds / 3600000);
				milliseconds = milliseconds % 3600000;

				var minutes = Math.floor(milliseconds / 60000);
				milliseconds = milliseconds % 60000;

				var seconds = Math.floor(milliseconds / 1000);
				milliseconds = milliseconds % 1000;

				if (hours <= 0) {
					return startWith + toFixed(minutes) + 'm: ' + toFixed(seconds) + 's';
				} else if (hours < 24) {
					return startWith + toFixed(hours) + 'h: ' + toFixed(minutes) + ':m ' + toFixed(seconds) + 's';
				} else {
					var days = Math.floor(hours / 24);
					hours = hours % 24;

					return startWith + days + 'd ' + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm';
				}
			};
		}])

		.filter('secondsToHourMinutesSeconds', ['$filter', function ($filter) {
			return function (_seconds) {

				var startWith = '';

				if(_seconds < 0){
					startWith = '-';
					_seconds = Math.abs(_seconds);
				}

				var milliseconds = Math.round(_seconds * 1000);

				var hours = Math.floor(milliseconds / 3600000);
				milliseconds = milliseconds % 3600000;

				var minutes = Math.floor(milliseconds / 60000);
				milliseconds = milliseconds % 60000;

				var seconds = Math.floor(milliseconds / 1000);
				milliseconds = milliseconds % 1000;

				if (hours <= 0) {
					return startWith + toFixed(minutes) + ':' + toFixed(seconds);
				} else if (hours < 24) {
					return startWith + toFixed(hours) + ':' + toFixed(minutes) + ':' + toFixed(seconds);
				} else {
					var days = Math.floor(hours / 24);
					hours = hours % 24;

					return startWith + days + 'd ' + toFixed(hours) + ':' + toFixed(minutes);
				}
			};

		}]);

	function toFixed(time) {
		if (time >= 0 && time < 10) {
			return '0' + time;
		} else if (time > -10 && time < 0) {
			return '-0' + Math.abs(time);
		} else {
			return String(time);
		}
	}

})();

