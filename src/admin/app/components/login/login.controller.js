(function () {
	'use strict';

	angular.module('xpd.admin.login').controller('LoginController', LoginController);

	LoginController.$inject = ['$scope', '$uibModal', '$window', 'masterUserSetupAPIService', 'adminUserSetupAPIService'];

	function LoginController($scope, $uibModal, $window, masterUserSetupAPIService, adminUserSetupAPIService) {
		var vm = this;

		$scope.isCollapsed = true;

		vm.actionLinkSignInAsMaster = actionLinkSignInAsMaster;
		vm.actionButtonSignIn = actionButtonSignIn;

		function actionLinkSignInAsMaster() {

			$uibModal.open({
				keyboard: false,
				backdrop: 'static',
				templateUrl: './app/components/login/modal/master-login.modal.html',
				controller: 'MasterLoginController as mlController',
				resolve: {
					callback: function () {
						return masterUserModalCallback;
					}
				}
			});
		}

		function actionButtonSignIn() {

			$scope.collapseMessage = 'Checking Credentials';
			$scope.isCollapsed = false;

			adminUserSetupAPIService.authenticate($scope.login, function (data) {

				if (data) {
					$scope.isCollapsed = true;
					redirectToSetup();
				} else {
					$scope.collapseMessage = 'Invalid Credentials';
				}

			}, function (error) {
				$scope.isCollapsed = false;
				$scope.collapseMessage = 'Server Error. Contact Admin';
			});
		}

		/***************************************************/
		/***************************************************/
		/***************************************************/
		/***************************************************/

		function masterUserModalCallback(masterUser) {

			if (masterUser === null) {
				$scope.isCollapsed = true;
				return;
			}

			$scope.collapseMessage = 'Checking Credentials';
			$scope.isCollapsed = false;

			masterUserSetupAPIService.authenticate(masterUser, function (data) {

				if (data) {
					$scope.isCollapsed = true;
					openMasterPanel();
				} else {
					$scope.collapseMessage = 'Invalid Master User Credentials';
				}

			}, function (error) {
				$scope.isCollapsed = false;
				$scope.collapseMessage = 'Server Error. Contact Admin';
			});
		}

		/***************************************************/
		/***************************************************/
		/***************************************************/
		/***************************************************/

		function openMasterPanel() {
			$uibModal.open({
				keyboard: false,
				backdrop: 'static',
				templateUrl: './app/components/login/modal/master-panel.modal.html',
				controller: 'MasterPanelController as mpController',
				size: 'lg',
				resolve: {
					callback: function () {
						return masterUserModalCallback;
					}
				}
			});
		}

		function authenticationCallback() {
			console.log('Louco!');

			redirectToSetup();
		}

		function notAuthenticationCallback() {
			console.log('Não foi Louco!');
		}

		function redirectToSetup() {
			$window.location.href = './setup.html';
		}

	}

})();
