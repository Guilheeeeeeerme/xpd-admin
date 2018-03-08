/*
* @Author: Gezzy Ramos
* @Date:   2017-08-24 09:49:02
* @Last Modified by:   Gezzy Ramos
* @Last Modified time: 2017-08-29 10:33:21
*/

(function () {
	'use strict';

	angular.module('xpd.setup-form-input')
		.directive('xpdSetupFormInput', xpdSetupFormInput);

	xpdSetupFormInput.$inject = [];
	
	function xpdSetupFormInput() {

		return {
			restrict: 'E',
			scope: {
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
				charLimitation: '@'
			},
			templateUrl: '../xpd-resources/ng/xpd.setup-form-input/setup-form-input.template.html'

		};

	}
})();