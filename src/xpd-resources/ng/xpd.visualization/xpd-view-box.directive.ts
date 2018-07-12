export class XPDViewBoxDirective implements ng.IDirective {
	public scope: {
		'xpdViewBox': '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: ng.IScope,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		scope.$watch('xpdViewBox', function(xpdViewBox: any) {
			if (xpdViewBox != null) {
				element[0].setAttribute('viewBox', xpdViewBox);
			}

		});
	}

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDViewBoxDirective();
	}

}
