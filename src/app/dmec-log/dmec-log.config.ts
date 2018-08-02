
import DMECTemplate from './components/dmec-log/dmec-log.template.html';

const DMECConfig = ($routeProvider) => {

	$routeProvider.when('/', {
		template: DMECTemplate,
		controller: 'DMecLogController as dmlController',
	});

};

DMECConfig.$inject = ['$routeProvider'];

export { DMECConfig };
