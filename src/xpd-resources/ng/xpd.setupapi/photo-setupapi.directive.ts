// (function() {
// 	'use strict',

// 	angular.module('xpd.setupapi').directive('photoApiDirective', photoApiDirective);

	// photoApiDirective.$inject = ['photoAPIService'];

import { PhotoAPIService } from './photo-setupapi.service';

export class PhotoApiDirective implements ng.IDirective {

	public restrict: 'A';
	public scope = {
		photoApiDirectivePhotoName: '=',
	};

	constructor(private photoAPIService: PhotoAPIService) { }

	public link: ng.IDirectiveLinkFn = (
		scope: any,
		element: ng.IAugmentedJQuery,
		attrs: ng.IAttributes,
		ctrl: any,
	) => {

		scope.$watch('photoApiDirectivePhotoName', setPhoto);

		function setPhoto(photoApiDirectivePhotoName) {

			const photoName = scope.photoApiDirectivePhotoName || 'default';
			const photoPath = attrs.photoApiDirectiveServerPath;

			this.photoAPIService.loadPhoto(photoPath, photoName, function(baseStr64) {

				const image = 'data:image/jpeg;base64,' + baseStr64;

				if (element[0].tagName == 'image') {
					element[0].setAttribute('href', image);
				} else {
					element[0].setAttribute('src', image);
				}
			});
		}
	}

	public static Factory(): ng.IDirectiveFactory {
		const directive = (photoAPIService: PhotoAPIService) => new PhotoApiDirective(photoAPIService);
		directive.$inject = ['photoAPIService'];
		return directive;
	}

}

// })();
