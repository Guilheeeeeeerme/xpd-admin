import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { DialogService } from '../xpd.dialog/xpd.dialog.factory';
import { AuthService } from '../xpd.setupapi/auth.service';
import { XPDAccessService } from './access.service';

export class AccessFactoryController {

	public static $inject = [
		'$scope',
		'$window',
		'dialogService',
		'authService',
		'xpdAccessService'];

	constructor(
		private $scope,
		private $window: ng.IWindowService,
		private dialogService: DialogService,
		private authService: AuthService,
		private xpdAccessService: XPDAccessService) {

		const vm = this;

		$scope.dados = {
			XPDAccessData: JSON.parse(localStorage.getItem('xpd.admin.XPDAccessData_V2')),
			loginError: false,
		};

		$scope.user = {

		};

		$scope.authForm = {};

		const actionButtonSave = () => {
			vm.dialogService.showConfirmDialog('This action will reload your aplication screen. Proceed?', () => {
				actionProceed();
			});
		};

		const actionProceed = () => {
			localStorage.setItem('xpd.admin.XPDAccessData_V2', JSON.stringify($scope.dados.XPDAccessData));

			vm.xpdAccessService.loadAccessData();

			if ($scope.isRegister) {

				vm.authService.register($scope.user).success(() => {
					vm.$window.location.reload();
				});
			} else {
				vm.authService.login($scope.user).finally(() => {
					vm.$window.location.reload();
				}).catch((e) => {
					// vm.$scope.dados.loginError = true;
					// console.log('loginError', vm.$scope.dados.loginError);
				});
			}
		};

		$scope.actionButtonSave = actionButtonSave;

	}

}
