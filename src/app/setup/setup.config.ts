import { OperationController } from './components/operation/operation.controller';
import OperationTemplate from './components/operation/operation.template.html';
import { SectionController } from './components/section/section.controller';
import SectionTemplate from './components/section/section.template.html';
import { WellController } from './components/well/well.controller';
import WellTemplate from './components/well/well.template.html';

const SetupConfig = ($routeProvider) => {

	$routeProvider.when('/', {
		template: WellTemplate,
		controller: WellController.name + ' as wellController',
	});
	$routeProvider.when('/well', {
		template: WellTemplate,
		controller: WellController.name + ' as wellController',
	});
	$routeProvider.when('/well/:wellId/section', {
		template: SectionTemplate,
		controller: SectionController.name + ' as sectionController',
	});

	$routeProvider.when('/well/:wellId/section/:sectionId/operation', {
		template: OperationTemplate,
		controller: OperationController.name + ' as operationController',
	});

};

SetupConfig.$inject = ['$routeProvider'];

export { SetupConfig };
