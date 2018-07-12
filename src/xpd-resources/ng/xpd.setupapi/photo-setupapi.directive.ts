(function() {
	'use strict',

	angular.module('xpd.setupapi').directive('photoApiDirective', photoApiDirective);

	photoApiDirective.$inject = ['photoAPIService'];

	function photoApiDirective(photoAPIService) {

		return {
			restrict: 'A',
			scope: {
				photoApiDirectivePhotoName: '=',
			},
			link(scope, element, attrs) {

				scope.$watch('photoApiDirectivePhotoName', setPhoto);

				function setPhoto(photoApiDirectivePhotoName) {

					const photoName = scope.photoApiDirectivePhotoName || 'default';
					const photoPath = attrs.photoApiDirectiveServerPath;

					photoAPIService.loadPhoto(photoPath, photoName, function(baseStr64) {

						const image = 'data:image/jpeg;base64,' + baseStr64;

						if (element[0].tagName == 'image') {
							element[0].setAttribute('href', image);
						} else {
							element[0].setAttribute('src', image);
						}
					});
				}

			},
		};

	}

})();
