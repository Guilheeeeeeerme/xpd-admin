
import * as angular from 'angular';

export class SetupAPIConfig {
	public static $inject: string[] = ['toastrConfig'];

	constructor(toastrConfig: any) {
		angular.extend(toastrConfig, {
			autoDismiss: true,
			extendedTimeOut: 3000,
			maxOpened: 4,
			newestOnTop: true,
			preventOpenDuplicates: true,
			tapToDismiss: true,
			timeOut: 2000,
			positionClass: 'toast-bottom-center',
		});
	}
}
