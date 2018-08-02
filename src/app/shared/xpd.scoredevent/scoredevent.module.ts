import * as angular from 'angular';
import { XPDScoredEventsDirective } from './scoredevent.directive';

const XPDScoredEventModule: angular.IModule = angular.module('xpd.setup-form-input', []);
export  { XPDScoredEventModule };

XPDScoredEventModule.directive('xpdScoredEvents', XPDScoredEventsDirective.Factory());

// (function() {
// 	'use strict';

// 	function xpdScoredEvents() {
// 		// Runs during compile
// 		return {
// 			scope: {
// 				eventList: '=',
// 				name: '@name',
// 			},
// 			restrict: 'A',
// 			template: '<table class="table">' +
// 			'<caption>{{ name }}</caption>' +
// 			'<thead>' +
// 			'<tr>' +
// 			'<th>Start Time</th>' +
// 			'<th>Duration</th>' +
// 			'<th>Vtarget</th>' +
// 			'<th>Consistence</th>' +
// 			'</tr>' +
// 			'</thead>' +
// 			'<tbody>' +
// 			'<tr ng-repeat="event in eventList | orderBy: \'startTime\' ">' +
// 			'<td>{{ event.startTime | date: \'mediumTime\' }}</td>' +
// 			'<td>{{ (event.duration / 1000) | number: 0 }}</td>' +
// 			'<td>{{ (event.target / 1000) }}</td>' +
// 			'<td>{{ event.score | number: 1 }}</td>' +
// 			'</tr>' +
// 			'</tbody>' +
// 			'</table>',
// 		};
// 	}

// })();
