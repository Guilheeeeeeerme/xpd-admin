import WellViewOnlyTemplate from './components/well-view-only/well-view-only.template.html';

const WellConfig = ($routeProvider) => {

	$routeProvider.when('/', {
		template: WellViewOnlyTemplate,
		controller: 'WellViewOnlyController as wvoController',
	});

	$routeProvider.when('/:wellId', {
		template: WellViewOnlyTemplate,
		controller: 'WellViewOnlyController as wvoController',
	});

};

WellConfig.$inject = ['$routeProvider'];

export { WellConfig };
