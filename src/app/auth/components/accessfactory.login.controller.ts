import { XPDAccessService } from '../../shared/xpd.access/access.service';
import { AccessFactoryController } from '../../shared/xpd.access/accessfactory.controller';
import { DialogService } from '../../shared/xpd.dialog/xpd.dialog.factory';
import { AuthService } from '../../shared/xpd.setupapi/auth.service';

export class AccessFactoryLoginController extends AccessFactoryController {

	public static $inject = [
		'$scope',
		'$window',
		'dialogService',
		'authService',
		'xpdAccessService'];

	constructor(
		$scope,
		$window: ng.IWindowService,
		dialogService: DialogService,
		authService: AuthService,
		xpdAccessService: XPDAccessService) {
		super(
			$scope,
			$window,
			dialogService,
			authService,
			xpdAccessService);

		if (AuthService.isLogged()) {
			AuthService.skipAuth();
		}

	}

}
