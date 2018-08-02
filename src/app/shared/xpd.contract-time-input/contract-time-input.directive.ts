// (function() {

// 	'use strict';

// 	/**
//      * Diretiva que recebe como entrada uma velocidade de contrato de parâmetro
//      * de tempo e transforma em um input com uma notação de duração (HH:mm:ss)
//      *
//      * Entrada: Velocidade (VOptimum / VStandard / Vpoor)
//      * Saída: Tempo (HH:mm:ss)
//      */

// 	contractTimeInput.$inject = [];
import * as angular from 'angular';
import template from './contract-time-input.template.html';

export class ContractTimeInputDirective {
	public static $inject: string[] = [];
	public restrict = 'E';
	public require = '^ngModel';
	public scope = {
		modalTitle: '@',
		contractTimeForm: '=',
		ngModel: '=',
		name: '@',
		min: '@',
		max: '@',
		disabled: '@',
		required: '@',
		ngChange: '&',
		atLeast: '@',
		atMost: '@',
	};
	public template = template;

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.watchInput = watchInput;

		scope.$watch('ngModel', function (ngModel) {

			if (angular.isDefined(ngModel)) {

				ngModel = 3600000 / ngModel;

				let date = new Date(ngModel).getTime();

				scope.hours = Math.floor(date / 3600000);
				date = date % 3600000;

				scope.minutes = Math.floor(date / 60000);
				date = date % 60000;

				scope.seconds = Math.floor(date / 1000);
				date = date % 1000;
			}

		}, true);

		function watchInput() {

			/**
			 * Garante que o min e max nunca fiquem vazios
			 */
			if (scope.max && !isNaN(+scope.max)) {
				scope.lastMax = scope.max;
			}
			if (scope.min && !isNaN(+scope.min)) {
				scope.lastMin = scope.min;
			}

			scope.hours = +scope.hours;
			scope.minutes = +scope.minutes;
			scope.seconds = +scope.seconds;

			let ngModel = null;

			if (isNaN(+scope.hours)) {
				scope.hours = 0;
			}

			if (isNaN(+scope.minutes)) {
				scope.minutes = 0;
			}

			if (isNaN(+scope.seconds)) {
				scope.seconds = 0;
			}

			const hours = +scope.hours;
			const minutes = +scope.minutes;
			const seconds = +scope.seconds;

			const actualDuration = ((hours * 3600000) + (minutes * 60000) + (seconds * 1000));
			ngModel = (actualDuration != 0) ? 3600000 / actualDuration : null;

			ctrl.$setViewValue(ngModel);

		}

	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new ContractTimeInputDirective();
	}
}
// })();
