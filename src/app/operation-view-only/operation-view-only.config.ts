// (function() {
// 'use strict';

import OperationViewOnlyTemplate from './components/operation-view-only/operation-view-only.template.html';

OperationConfig.$inject = ['$routeProvider'];

function OperationConfig($routeProvider) {

	$routeProvider.when('/', {
		template: OperationViewOnlyTemplate,
		controller: 'OperationViewOnlyController as ovoController',
	});

	$routeProvider.when('/:operationId', {
		template: OperationViewOnlyTemplate,
		controller: 'OperationViewOnlyController as ovoController',
	});

}

export { OperationConfig };
