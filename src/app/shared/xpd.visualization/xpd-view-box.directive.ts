export class XPDViewBoxDirective implements ng.IDirective {

	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDViewBoxDirective();
	}

	public scope = {
		xpdViewBox: '=',
	};

	public link: ng.IDirectiveLinkFn = (
		scope: ng.IScope,
		element: ng.IAugmentedJQuery,
	) => {

		scope.$watch('xpdViewBox', (xpdViewBox: any) => {
			if (xpdViewBox != null) {
				element[0].setAttribute('viewBox', xpdViewBox);
			}

		});
	}

}
