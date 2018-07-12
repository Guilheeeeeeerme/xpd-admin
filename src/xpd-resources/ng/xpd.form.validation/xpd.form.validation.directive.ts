angular.module('xpd.form.validation', [])
	.directive('xpdFormValidation', function() {
		return {
			restrict: 'A',
			require: '^ngModel',
			priority: 1,
			scope: {
				ngModel: '=',
				xpdFormValidation: '=',
			},
			link,
		};

		function link(scope, element, attrs) {

			let isFirst = true;

			let parent = element.parent();

			// AQUI CRIA UM ELEMENTO PARA CADA CHAMADA
			let errorElement = document.createElement('span');

			let style = '';
			style += 'color: red;';
			style += 'font-style: italic;';
			style += 'display: table-footer-group;';

			errorElement.style = style;

			parent.append(errorElement);

			scope.$watch('ngModel', function() {
				errorElement.innerHTML = '';

				let form = null;

				if (scope.xpdFormValidation && scope.xpdFormValidation[attrs.name]) {
					form = scope.xpdFormValidation[attrs.name];
				} else {
					return;
				}

				let error = form.$error;

				if (!isFirst && !form.$valid) {

					for (let errorType in error) {
						errorElement.innerHTML += genericInputMessageError(errorType);
					}
				}

				isFirst = false;

			}, true);

			function genericInputMessageError(errorType) {

				if (errorType == 'max') {
					if (attrs.atLeast != undefined) {
						return 'this field should be at least "' + attrs.atLeast + '" <br/>';
					} else if (!attrs.min || attrs.min == '') {
						return 'this field should be at most ' + attrs.max + '<br/>';
										} else {
						return 'this field should be between ' + attrs.min + ' and ' + attrs.max + '<br/>';
										}

				} else if (errorType == 'min') {
					if (attrs.atMost != undefined) {
						return 'this field should be at most "' + attrs.atMost + '" <br/>';
					} else if (!attrs.max || attrs.max == '') {
						return 'this field should be at least ' + attrs.min + '<br/>';
										} else {
						return 'this field should be between ' + attrs.min + ' and ' + attrs.max + '<br/>';
										}

				} else if (errorType == 'required') {
					return 'this field is mandatory';
				} else if (errorType == 'number') {
					return 'this field should be a valid number';
				} else {
					return JSON.stringify(errorType);
				}

			}

		}

	});
