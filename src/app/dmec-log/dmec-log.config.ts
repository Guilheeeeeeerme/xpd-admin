
import DMECTemplate from './dmec-log.html';

export class AdminConfig {
	public static $inject = ['$routeProvider'];

	constructor($routeProvider) {

		$routeProvider.when('/', {
			template: DMECTemplate,
			controller: 'DMecLogController as dmlController',
		});

	}

}
