import { DMECService } from '../../../../xpd-resources/ng/xpd.dmec/dmec.service';

export class DMECLogController {
	// 'use strict';

	// angular.module('xpd.dmeclog')
	// 	.controller('DMecLogController', DMecLogController);

	public static $inject = ['$scope', 'dmecService'];

	constructor($scope, dmecService: DMECService) {
		dmecService.dmec($scope, 'xpd.dmec.log.dmecInputRangeForm');
		$scope.initializeComponent();
	}

}
