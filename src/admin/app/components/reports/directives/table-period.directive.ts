(function() {
	'use strict';

	angular.module('xpd.reports')
		.directive('tablePeriod', tablePeriod);

	tablePeriod.$inject = [];

	function tablePeriod() {
		return {
			restrict: 'EA',
			templateUrl: 'app/components/reports/directives/table-period.template.html',
			scope: {
				initialDate: '=',
				finalDate: '=',
				minDate: '=',
				maxDate: '=',
				functionChangePeriod: '=',
				dateTime: '=',
			},
			link,
		};

		function link(scope, elem, attr) {

			scope.$watchGroup(['minDate', 'maxDate'], function(newValues) {
				setLimitDateInInput(newValues[0], newValues[1]);
			}, true);

			scope.onDataRangeChange = onDataRangeChange;

			function setLimitDateInInput(minDate, maxDate) {

				if (attr.maxDate != null && attr.minDate != null) {

					let dateTimeInputs = elem[0].querySelectorAll('.table-period-date-limit');
					let max = toJSONLocal(maxDate);
					let min = toJSONLocal(minDate);

					dateTimeInputs[0].max = max;
					dateTimeInputs[0].min = min;

					dateTimeInputs[1].max = max;
					dateTimeInputs[1].min = min;

				}
			}

			function toJSONLocal(date) {

				if (date == undefined) { return; }

				let local = new Date(date);
				local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
				return local.toJSON().slice(0, 19);
			}

			function onDataRangeChange() {
				if (scope.initialDate && scope.initialDate.getTime() > scope.finalDate.getTime()) {
					scope.initialDate = new Date(scope.finalDate.getFullYear(), scope.finalDate.getMonth(), scope.finalDate.getDate(), 0, 0, 0, 0);
				}
			}

		}
	}
})();
