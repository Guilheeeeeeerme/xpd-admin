angular.module('xpd.form.validation', [])
	.directive('xpdFormValidation', function () {
		return {
			restrict: 'A',
			require: '^ngModel',
			priority: 1,
			scope: {
				ngModel: '=',
				xpdFormValidation: '='
			},
			link: link
		};

		function link (scope, element, attrs) {

			let isFirst = true;

			var parent = element.parent();
			
			// AQUI CRIA UM ELEMENTO PARA CADA CHAMADA
			var errorElement = document.createElement('span');

			var style = '';
			style += 'color: red;';
			style += 'font-style: italic;';
			style += 'display: table-footer-group;';

			errorElement.style = style;

			parent.append(errorElement);

			scope.$watch('ngModel', function(){
				errorElement.innerHTML = '';
				
				var form = null;
				
				if(scope.xpdFormValidation && scope.xpdFormValidation[attrs.name]){
					form = scope.xpdFormValidation[attrs.name];
				}else{
					return;
				}

				var error = form.$error;
				
				if (!isFirst && !form.$valid) {

					for(var errorType in error){
						errorElement.innerHTML += genericInputMessageError(errorType);
					}
				}

				isFirst = false;

			}, true);

			function genericInputMessageError(errorType) {

				if (errorType == 'max') {
					if(attrs.atLeast != undefined)
						return 'this field should be at least "' + attrs.atLeast + '" <br/>';
					else if (!attrs.min || attrs.min == '')
						return 'this field should be at most ' + attrs.max + '<br/>';
					else
						return 'this field should be between ' + attrs.min + ' and ' + attrs.max + '<br/>';

				} else if (errorType == 'min') {
					if (attrs.atMost != undefined)
						return 'this field should be at most "' + attrs.atMost + '" <br/>';
					else if (!attrs.max || attrs.max == '')
						return 'this field should be at least ' + attrs.min + '<br/>';
					else
						return 'this field should be between ' + attrs.min + ' and ' + attrs.max + '<br/>';

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

