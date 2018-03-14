(function () {

	angular.module('xpd.admin')
		.directive('rpdForm', rpdFormDirective);

	rpdFormDirective.$inject = ['$filter'];

	function rpdFormDirective($filter) {

		return {
			link: link,
			scope: {
				rig: '@',
				well: '@',
				dayDriller: '@',
				nightDriller: '@',
				adpNumber: '@',
				date: '@',
				time: '@',
				tasks: '='
			},
			templateUrl: '../xpd-resources/ng/xpd.rpd/rpd.template.html'
		};

		function link(scope, element) {

			scope.toStateArray = toStateArray;
			scope.getFailures = getFailures;
			scope.getAlarms = getAlarms;

			setTimeout(prepareButtonsToExport, 5000);

			function toStateArray(stateObject) {

				var stateArray = [];

				for (var i in stateObject.children) {
					stateArray.push(stateObject.children[i]);
				}

				return $filter('orderBy')(stateArray, '[startTime,  endTime]');
			}

			function getAlarms(root) {
				var alarmsIndex = {};

				var events = root.values;

				for (var i in events) {
					var event = events[i];

					if (event.durationAlarm && !alarmsIndex[event.durationAlarm.id]) {
						alarmsIndex[event.durationAlarm.id] = event.durationAlarm;
					}else{
						for (var j in event.alarms) {
							var alarm = event.alarms[j];
	
							if (!alarmsIndex[alarm.id]) {
								alarmsIndex[alarm.id] = alarm;
							}
						}
					}

				}

				var list = [];

				for (var t in alarmsIndex) {
					list.push(alarmsIndex[t]);
				}

				return list;

			}

			function getFailures(root) {
				var failuresIndex = {};

				var events = root.values;

				for (var i in events) {
					var event = events[i];

					for (var j in event.failures) {
						var failure = event.failures[j];

						if (!failuresIndex[failure.id]) {
							failuresIndex[failure.id] = failure;
						}
					}

				}

				var list = [];

				for (var t in failuresIndex) {
					list.push(failuresIndex[t]);
				}

				return list;
			}

			function prepareButtonsToExport() {

				TableExport(element[0].getElementsByTagName('table'), {
					filename: 'RZX-RPD-' + scope.date,
					headers: true,
					footers: true,
					formats: ['xlsx', 'csv', 'txt'],
					bootstrap: false,
					exportButtons: true,
					position: 'bottom',
					ignoreRows: null,
					ignoreCols: null,
					trimWhitespace: true
				});

			}

		}
	}

}());