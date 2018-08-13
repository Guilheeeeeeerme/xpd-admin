// (function() {
// 	'use strict';

import './table-period.style.scss';
import template from './table-period.template.html';

export class TablePeriod implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new TablePeriod();
	}

	public restrict: 'EA';
	public template = template;
	public scope = {
		initialDate: '=',
		finalDate: '=',
		minDate: '=',
		maxDate: '=',
		functionChangePeriod: '&',
		dateTime: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		elem: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.$watchGroup(['minDate', 'maxDate'], function (newValues) {
			setLimitDateInInput(newValues[0], newValues[1]);
		}, true);

		scope.onDataRangeChange = onDataRangeChange;

		function setLimitDateInInput(minDate, maxDate) {

			if (attrs.maxDate != null && attrs.minDate != null) {

				const dateTimeInputs: any = elem[0].querySelectorAll('.table-period-date-limit');
				const max = toJSONLocal(maxDate);
				const min = toJSONLocal(minDate);

				dateTimeInputs[0].max = max;
				dateTimeInputs[0].min = min;

				dateTimeInputs[1].max = max;
				dateTimeInputs[1].min = min;

			}
		}

		function toJSONLocal(date) {

			if (date === undefined) { return; }

			const local = new Date(date);
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
// }) ();
