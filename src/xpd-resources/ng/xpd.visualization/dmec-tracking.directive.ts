// (function() {
// 	'use strict';
// 	angular.module('xpd.visualization').directive('dmecTracking', dmecTrackingDirective);
// 	dmecTrackingDirective.$inject = ['dmecService'];

import template from '../xpd-resources/ng/xpd.visualization/dmec-tracking.template.html';
import { DMECService } from '../xpd.dmec/dmec.service';

export class DMECTrackingDirective implements ng.IDirective {
	public scope = {
		connectionEvents: '=',
		tripEvents: '=',
		timeEvents: '=',
		currentOperation: '=',
		currentEvent: '=',
		currentTick: '=',
		currentBlockPosition: '=',
		currentReading: '=',
	};
	public restrict = 'AE';
	public template = template;

	constructor(private dmecService: DMECService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {
		this.dmecService.dmec(scope,
			'xpd.admin.dmec.dmecInputRangeForm',
			function () {
				return scope.currentOperation;
			},
			function () {
				return scope.currentReading;
			},
		);
	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (dmecService: DMECService) => new DMECTrackingDirective(dmecService);
		directive.$inject = ['dmecService'];
		return directive;
	}

}
