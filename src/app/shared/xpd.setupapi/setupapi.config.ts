
import * as angular from 'angular';

const SetupAPIConfig = (toastrConfig: any) => {
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
};

SetupAPIConfig.$inject = ['toastrConfig'];

export { SetupAPIConfig };
