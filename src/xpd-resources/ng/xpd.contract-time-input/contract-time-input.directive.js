(function() {

	'use strict';

	/**
     * Diretiva que recebe como entrada uma velocidade de contrato de parâmetro
     * de tempo e transforma em um input com uma notação de duração (HH:mm:ss)
     *
     * Entrada: Velocidade (VOptimum / VStandard / Vpoor)
     * Saída: Tempo (HH:mm:ss)
     */
	angular.module('xpd.contractTimeInput', [])
		.directive('contractTimeInput', contractTimeInput);

	contractTimeInput.$inject = [];

	function contractTimeInput() {
		return {
			restrict: 'E',
			require: '^ngModel',
			scope: {
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
				atMost: '@'
			},
			templateUrl: '../xpd-resources/ng/xpd.contract-time-input/contract-time-input.template.html',
			link: link
		};

		function link(scope, element, attrs, ngModelCtrl) {
				
			scope.watchInput = watchInput;
				
			scope.$watch('ngModel', function (ngModel) {
				
				if (angular.isDefined(ngModel)) {

					ngModel = 3600000 / ngModel;
				
					var date = new Date(ngModel).getTime();
				
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
				if (scope.max && !isNaN(+scope.max))
					scope.lastMax = scope.max;
				if (scope.min && !isNaN(+scope.min)){
					scope.lastMin = scope.min;
				}

				scope.hours = +scope.hours;
				scope.minutes = +scope.minutes;
				scope.seconds = +scope.seconds;

				var ngModel = null;

				if(	isNaN(+scope.hours) ) 
					scope.hours = 0;

				if( isNaN(+scope.minutes) ) 
					scope.minutes = 0;
					
				if( isNaN(+scope.seconds) )
					scope.seconds = 0;
					
				var hours = +scope.hours;
				var minutes = +scope.minutes;
				var seconds = +scope.seconds;
					
				var actualDuration = ((hours * 3600000) + (minutes * 60000) + (seconds * 1000));
				ngModel = (actualDuration != 0 ) ? 3600000 / actualDuration : null;

				ngModelCtrl.$setViewValue(ngModel);
				
			}
				
		}
	}
})();
