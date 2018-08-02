import { DMECService } from '../../../shared/xpd.dmec/dmec.service';

export class DMECLogController {

	public static $inject = ['$scope', 'dmecService'];

	constructor($scope, dmecService: DMECService) {
		dmecService.dmec($scope, 'xpd.dmec.log.dmecInputRangeForm');
		$scope.initializeComponent();
	}

}
