/*
* @Author: Gezzy Ramos
* @Date:   2017-07-18 12:03:27
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 18:14:51
*/
// (function() {
// 	'use strict';

import template from './saved-alarms-list.template.html';

export class SavedAlarmsListDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new SavedAlarmsListDirective();
	}
	public scope = {
		heading: '@',
		popover: '@',
		alarmsList: '=',
		showArchived: '=',
		buttomIcon: '@',
		alarmsToImport: '=',
		actionClickButton: '&',
		actionImportButton: '&?',
	};
	public restrict = 'AE';
	public template = template;
}

	// })();
