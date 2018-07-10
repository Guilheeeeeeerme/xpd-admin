(function () {
	'use strict';

	var app = angular.module('xpd.filters', []);

	app.filter('percentage', percentage);
	app.filter('secondsToHourMinutes', secondsToHourMinutes);
	app.filter('xpdStateLabelFilter', xpdStateLabelFilter);
	app.filter('xpdEventLabelFilter', xpdEventLabelFilter);
	app.filter('secondsToHourMinutesSeconds', secondsToHourMinutesSeconds);
	app.filter('readingAttrFilter', readingAttrFilter);

	percentage.$inject = ['$filter'];
	xpdStateLabelFilter.$inject = ['$filter'];
	xpdEventLabelFilter.$inject = ['$filter'];
	secondsToHourMinutes.$inject = ['$filter'];
	secondsToHourMinutesSeconds.$inject = ['$filter'];
	readingAttrFilter.$inject = ['$filter'];
	
	function xpdEventLabelFilter($filter) {
		return function (event) {

			if( event && event.toLowerCase && event.toLowerCase() == 'trip' ){
				return 'Trip';
			}

			if( event && event.toLowerCase && event.toLowerCase() == 'conn' ){
				return 'Connection';
			}

			if( event && event.toLowerCase && event.toLowerCase() == 'time' ){
				return 'Time Procedure';
			}

			return 'Unknown Slips Condition';
		};

	}

	function xpdStateLabelFilter($filter) {
		return function (state) {
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
		return function (input, decimals) {
			return $filter('number')(input * 100, decimals) + '%';
		};
	}

	function secondsToHourMinutes($filter) {
		return function (_seconds) {

			var startWith = '';

			if (_seconds < 0) {
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
				return startWith + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm: ' + toFixed(seconds) + 's';
			} else {
				var days = Math.floor(hours / 24);
				hours = hours % 24;

				return startWith + days + 'd ' + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm';
			}
		};
	}

	function secondsToHourMinutesSeconds($filter) {
		return function (_seconds) {

			var startWith = '';

			if (_seconds < 0) {
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

	}

	function readingAttrFilter($filter) {
		return function (attribute) {
			switch (attribute) {
			case 'rpm':
				return 'RPM';
			case 'wob':
				return 'WOB';
			case 'flow':
				return 'Flow';
			case 'rop':
				return 'ROP';
			case 'torque':
				return 'Torque';
			case 'depth':
				return 'Depth';
			case 'blockPosition':
				return 'Block Position';
			case 'hookload':
				return 'Hook Load';
			case 'sppa':
				return 'SPPA';
			case 'date':
				return 'Date';
			case 'time':
				return 'Time';
			case 'bitDepth':
				return 'Bit Depth';
			case 'blockSpeed':
				return 'Block Speed';
			case 'timestamp':
				return 'Date';
			default:
				return 'Not Found!';
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