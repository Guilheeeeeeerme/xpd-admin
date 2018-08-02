export class XPDZeroTimeZoneDirective implements ng.IDirective {

	public static $inject: string[] = [];
	public static Factory(): ng.IDirectiveFactory {
		return () => new XPDZeroTimeZoneDirective();
	}

	public restrict = 'A';
	public priority = 1;
	public require = 'ngModel';

	public link: ng.IDirectiveLinkFn = (
		scope: ng.IScope,
		element: ng.IAugmentedJQuery,
		attributes: ng.IAttributes,
		ctrl: any,
	) => {

		ctrl.$formatters.push((value) => {
			value = new Date(value);

			let date = new Date(Date.parse(value));
			date = new Date(date.getTime() + (60000 * date.getTimezoneOffset()));

			return date;
		});

		ctrl.$parsers.push((value) => {
			value = new Date(value);

			const date = new Date(value.getTime() - (60000 * value.getTimezoneOffset()));

			return date;
		});
	}

}
