import { TableExport } from 'tableexport';
import template from './rpd.template.html';

export class XPDRPDFormDirective {

	public static $inject: string[] = ['$filter', '$timeout'];
	public static Factory(): ng.IDirectiveFactory {
		const directive = ($filter: any, $timeout: any) => new XPDRPDFormDirective($filter, $timeout);
		return directive;
	}
	public scope = {
		rig: '@',
		well: '@',
		dayDriller: '@',
		nightDriller: '@',
		adpNumber: '@',
		date: '@',
		time: '@',
		tasks: '=',
	};
	public template = template;

	constructor(private $filter: any, private $timeout: any) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		const self = this;

		this.$timeout(prepareButtonsToExport, 5000, scope);

		scope.toStateArray = (stateObject) => {

			const stateArray = [];

			for (const i in stateObject.children) {
				stateArray.push(stateObject.children[i]);
			}

			return self.$filter('orderBy')(stateArray, '[startTime,  endTime]');
		};

		scope.getAlarms = (root) => {
			const alarmsIndex = {};

			const events = root.values;

			for (const i in events) {
				const event = events[i];

				if (event.durationAlarm && !alarmsIndex[event.durationAlarm.id]) {
					alarmsIndex[event.durationAlarm.id] = event.durationAlarm;
				} else {
					for (const j in event.alarms) {
						const alarm = event.alarms[j];

						if (!alarmsIndex[alarm.id]) {
							alarmsIndex[alarm.id] = alarm;
						}
					}
				}

			}

			const list = [];

			for (const t in alarmsIndex) {
				list.push(alarmsIndex[t]);
			}

			return list;

		};

		scope.getFailures = (root) => {
			const failuresIndex = {};

			const events = root.values;

			for (const i in events) {
				const event = events[i];

				for (const j in event.failures) {
					const failure = event.failures[j];

					if (!failuresIndex[failure.id]) {
						failuresIndex[failure.id] = failure;
					}
				}

			}

			const list = [];

			for (const t in failuresIndex) {
				list.push(failuresIndex[t]);
			}

			return list;
		};

		function prepareButtonsToExport() {
			// TODO: uai? como?
			// tslint:disable-next-line:no-unused-expression
			new TableExport(element[0].getElementsByTagName('table'), {
				filename: 'RZX-RPD-' + scope.date,
				headers: true,
				footers: true,
				formats: ['xlsx', 'csv', 'txt'],
				bootstrap: false,
				exportButtons: true,
				position: 'bottom',
				ignoreRows: null,
				ignoreCols: null,
				trimWhitespace: true,
			});

		}

	}
}
