// (function() {
// 	'use strict';

// 	angular.module('xpd.visualization')
// 		.directive('consistencyInformationPanel', consistencyInformationPanel);

// 	consistencyInformationPanel.$inject = [];
import template from './consistency-information-panel.template.html';

export class ConsistencyInformationPanelDirective implements ng.IDirective {

	public restrict = 'EA';
	public template = template;
	public scope = {
		onInit: '=',
		onClickCollapse: '=',
		collapse: '=',
		state: '=',
		event: '=',
		isTripin: '=',
		score: '=',
		currentEventDuration: '=',
		jointDuration: '=',
		lastEventType: '=',
		lastTripDuration: '=',
		lastConnDuration: '=',
		eventProperty: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.duration = [];
		scope.percentageDuration = [];
		scope.colorPerformance = [];

		scope.getLastJointDuration = getLastJointDuration;

		scope.$watch('lastTripDuration', function (duration) {
			scope.duration.TRIP = duration;
		});

		scope.$watch('lastConnDuration', function (duration) {
			scope.duration.CONN = duration;
		});

		function getLastJointDuration() {
			const tripDuration = (scope.lastTripDuration) ? scope.lastTripDuration : 0;
			const connDuration = (scope.lastConnDuration) ? scope.lastConnDuration : 0;
			return tripDuration + connDuration;
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new ConsistencyInformationPanelDirective();
	}
}
