/*
* @Author: Gezzy Ramos
* @Date:   2017-08-24 09:49:02
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-29 10:33:21
*/

// (function() {
// 	'use strict';

// 	angular.module('xpd.setup-form-input')
// 		.directive('xpdSetupFormInput', xpdSetupFormInput);

// 	xpdSetupFormInput.$inject = [];
import template from './setup-form-input.template.html';

export class XPDSetupFormInputDirective implements ng.IDirective {

	public static $inject = [];

	public restrict = 'E';
	public scope = {
		type: '@',
		unit: '@',
		label: '@',
		name: '@',
		model: '=',
		change: '=',

		xpdPopover: '@',
		xpdPopoverHtml: '=',
		xpdPopoverTrigger: '@',
		xpdPopoverPlacement: '@',

		formName: '=',
		disabled: '@',
		min: '=',
		max: '=',
		pristine: '@',
		required: '@',
		precision: '@',
		charLimitation: '@',
	};
	public template = template;

	public static Factory(): ng.IDirectiveFactory {
		const directive = () => new XPDSetupFormInputDirective();
		return directive;
	}

}
// })();
