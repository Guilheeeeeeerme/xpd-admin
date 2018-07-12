(function() {
	'use strict';

	let app = angular.module('xpd.filters', []);

	app.filter('percentage', percentage);
	app.filter('secondsToHourMinutes', secondsToHourMinutes);
	app.filter('xpdStateLabelFilter', xpdStateLabelFilter);
	app.filter('xpdEventLabelFilter', xpdEventLabelFilter);
	app.filter('secondsToHourMinutesSeconds', secondsToHourMinutesSeconds);

	percentage.$inject = ['$filter'];
	xpdStateLabelFilter.$inject = ['$filter'];
	xpdEventLabelFilter.$inject = ['$filter'];
	secondsToHourMinutes.$inject = ['$filter'];
	secondsToHourMinutesSeconds.$inject = ['$filter'];

	function xpdEventLabelFilter($filter) {
		return function(event) {

			if ( event && event.toLowerCase && event.toLowerCase() == 'trip' ) {
				return 'Trip';
			}

			if ( event && event.toLowerCase && event.toLowerCase() == 'conn' ) {
				return 'Connection';
			}

			if ( event && event.toLowerCase && event.toLowerCase() == 'time' ) {
				return 'Time Procedure';
			}

			return 'Unknown Slips Condition';
		};

	}

	function xpdStateLabelFilter($filter) {
		return function(state) {
			switch (state) {

			case 'makeUp':
				return 'Make Up';
			case 'layDown':
				return 'Lay Down';
			case 'cased':
				return 'Cased Well';
			case 'drilling':
				return 'Drilling';
			case 'openSea':
				return 'Open Sea';
			case 'openHole':
				return 'Open Hole';
			case 'inBreakDPInterval':
				return 'In Break DP Interval';
			case 'casing':
				return 'Casing';
			case 'settlementString':
				return 'Settlement String';
			case 'belowShoeDepth':
				return 'Below Shoe Depth';
			case 'cementation':
				return 'Cementation';
			case 'ascentRiser':
				return 'Ascent Riser';
			case 'descendRiser':
				return 'Descend Riser';
			case 'time':
				return 'Time';
			default:
				return 'Not Found!';
			}

		};

	}

	function percentage($filter) {
		return function(input, decimals) {
			return $filter('number')(input * 100, decimals) + '%';
		};
	}

	function secondsToHourMinutes($filter) {
		return function(_seconds) {

			let startWith = '';

			if (_seconds < 0) {
				startWith = '-';
				_seconds = Math.abs(_seconds);
			}

			// TODO durações negativas

			let milliseconds = Math.round(_seconds * 1000);

			let hours = Math.floor(milliseconds / 3600000);
			milliseconds = milliseconds % 3600000;

			let minutes = Math.floor(milliseconds / 60000);
			milliseconds = milliseconds % 60000;

			let seconds = Math.floor(milliseconds / 1000);
			milliseconds = milliseconds % 1000;

			if (hours <= 0) {
				return startWith + toFixed(minutes) + 'm: ' + toFixed(seconds) + 's';
			} else if (hours < 24) {
				return startWith + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm: ' + toFixed(seconds) + 's';
			} else {
				let days = Math.floor(hours / 24);
				hours = hours % 24;

				return startWith + days + 'd ' + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm';
			}
		};
	}

	function secondsToHourMinutesSeconds($filter) {
		return function(_seconds) {

			let startWith = '';

			if (_seconds < 0) {
				startWith = '-';
				_seconds = Math.abs(_seconds);
			}

			let milliseconds = Math.round(_seconds * 1000);

			let hours = Math.floor(milliseconds / 3600000);
			milliseconds = milliseconds % 3600000;

			let minutes = Math.floor(milliseconds / 60000);
			milliseconds = milliseconds % 60000;

			let seconds = Math.floor(milliseconds / 1000);
			milliseconds = milliseconds % 1000;

			if (hours <= 0) {
				return startWith + toFixed(minutes) + ':' + toFixed(seconds);
			} else if (hours < 24) {
				return startWith + toFixed(hours) + ':' + toFixed(minutes) + ':' + toFixed(seconds);
			} else {
				let days = Math.floor(hours / 24);
				hours = hours % 24;

				return startWith + days + 'd ' + toFixed(hours) + ':' + toFixed(minutes);
			}
		};

	}

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
