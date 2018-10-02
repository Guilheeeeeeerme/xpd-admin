import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { AuthService } from '../xpd.setupapi/auth.service';
import { XPDAccessService } from './access.service';
import { AccessFactoryController } from './accessfactory.controller';

export class AccessFactoryModalController extends AccessFactoryController {

	public static $inject = [
		'$scope',
		'$window',
		'dialogService',
		'authService',
		'xpdAccessService',
		'actionButtonCancel'];

	constructor(
		$scope,
		$window: ng.IWindowService,
		dialogService: DialogService,
		authService: AuthService,
		xpdAccessService: XPDAccessService,
		private actionButtonCancelCalback) {
		super(
			$scope,
			$window,
			dialogService,
			authService,
			xpdAccessService);

		const actionButtonLogout = () => {
			AuthService.logout();
		};

		const actionButtonCancel = () => {
			actionButtonCancelCalback();
		};

		$scope.actionButtonCancel = actionButtonCancel;
		$scope.actionButtonLogout = actionButtonLogout;

	}

}
