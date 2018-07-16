
import DMECTemplate from './components/dmec-log/dmec-log.template.html';

DMECConfig.$inject = ['$routeProvider'];

function DMECConfig($routeProvider) {

	$routeProvider.when('/', {
		template: DMECTemplate,
		controller: 'DMecLogController as dmlController',
	});

}

export { DMECConfig };
