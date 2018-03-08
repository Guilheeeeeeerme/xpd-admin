(function () {

	'use strict';

	angular.module('ui.bootstrap')
		.directive('popoverOutsideClick', popoverOutsideClick);

	popoverOutsideClick.$inject = ['$document'];

	function popoverOutsideClick($document) {
		return {
			restrict: 'A',
			scope: {
				popoverIsOpen: '='
			},
			link: function (scope, elem, attr, ctrl) {

				elem.bind('click', function (e) {
					e.stopPropagation();
				});

				$document.bind('click', function () {
					scope.popoverIsOpen = false;
				});
			}
		};
	}
})();

