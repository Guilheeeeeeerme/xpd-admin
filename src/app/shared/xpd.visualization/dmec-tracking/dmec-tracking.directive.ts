// (function() {
// 	'use strict';

import { DMECService } from '../../xpd.dmec/dmec.service';
import './dmec-tracking.style.scss';
import template from './dmec-tracking.template.html';

export class DMECTrackingDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		const directive = (dmecService: DMECService) => new DMECTrackingDirective(dmecService);
		directive.$inject = ['dmecService'];
		return directive;
	}
	public scope = {
		connectionEvents: '=',
		tripEvents: '=',
		timeEvents: '=',
		currentOperation: '=',
		currentEvent: '=',
		currentTick: '=',
		currentBlockPosition: '=',
		selectedReadings: '=',
		currentReading: '=',
		lastSelectedPoint: '=',
		removeMarker: '=',
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
			() => {
				return scope.currentOperation;
			},
			() => {
				return scope.currentReading;
			},
		);
	}

}
