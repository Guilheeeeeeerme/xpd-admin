// (function() {
// 	'use strict',

import { PhotoAPIService } from './photo-setupapi.service';

export class PhotoApiDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		const directive = (photoAPIService: PhotoAPIService) => new PhotoApiDirective(photoAPIService);
		directive.$inject = ['photoAPIService'];
		return directive;
	}

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

		const vm = this;

		scope.$watch('photoApiDirectivePhotoName', (photoApiDirectivePhotoName) => {

			const photoName = scope.photoApiDirectivePhotoName || 'default';
			const photoPath = attrs.photoApiDirectiveServerPath;

			vm.photoAPIService.loadPhoto(photoPath, photoName).then( (baseStr64) => {

				const image = 'data:image/jpeg;base64,' + baseStr64;

				if (element[0].tagName === 'image') {
					element[0].setAttribute('href', image);
				} else {
					element[0].setAttribute('src', image);
				}
			});
		});
	}

}

// })();
