/*
* @Author: Gezzy Ramos
* @Date:   2017-07-18 12:03:27
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-28 18:14:51
*/
(function() {
	'use strict';

	angular.module('xpd.admin').directive('savedAlarmsList', savedAlarmsList);

	function savedAlarmsList() {
		return {
			scope: {
				heading: '@',
				popover: '@',
				alarmsList: '=',
				showArchived: '=',
				buttomIcon: '@',
				alarmsToImport: '=',
				actionClickItem: '=',
				actionClickButton: '=',
				actionImportButton: '=',
			},
			restrict: 'AE',
			templateUrl: 'app/components/admin/directives/saved-alarms-list.template.html',
			link,
		};

		function link(scope, element, attrs) {

		}
	}
})();
