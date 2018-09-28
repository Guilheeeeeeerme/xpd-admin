import loginTemplate from '../shared/xpd.access/accessfactory-form.template.html';
import { AccessFactoryLoginController } from './components/accessfactory.login.controller';

const AuthConfig = ($routeProvider) => {

	$routeProvider.when('/', {
		controller: AccessFactoryLoginController.name + ' as accessFactoryController',
		template: loginTemplate,
	});

	$routeProvider.when('/login', {
		controller: AccessFactoryLoginController.name + ' as accessFactoryController',
		template: loginTemplate,
	});
	// $routeProvider.when('/register', {
	// 	template: WellTemplate,
	// 	controller: WellController.name + ' as wellController',
	// });

};

AuthConfig.$inject = ['$routeProvider'];

export { AuthConfig };
