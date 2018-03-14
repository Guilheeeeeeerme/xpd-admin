(function () {
	'use strict';

	angular.module('xpd.accessfactory')
		.directive('accessFactoryDirective', accessFactoryDirective);

	accessFactoryDirective.$inject = ['$localStorage', '$uibModal', 'dialogFactory'];

	function accessFactoryDirective($localStorage, $uibModal, dialogFactory){
		
		return {
			restrict: 'E',
			scope:{
				hideReports: '@',
				hideSetup: '@'
			},
			templateUrl: '../xpd-resources/ng/xpd.access/accessfactory.template.html',
			link: link
		};

		function link(scope, elem, attrs){

			var modalInstance;

			scope.actionButtonEditAccessData = actionButtonEditAccessData;
			scope.actionButtonSave = actionButtonSave;
			scope.actionButtonCancel = actionButtonCancel;

			function actionButtonSave(){
				dialogFactory.showConfirmDialog('This action will reload your aplication screen. Proceed?', actionProceed);
			}

			function actionProceed(){
				$localStorage.$default(scope.dados.XPDAccessData);
				location.reload();
			}

			function actionButtonCancel(){
				modalInstance.close();
				modalInstance = null;
			}

			function actionButtonEditAccessData(){
				scope.dados = {
					XPDAccessData: $localStorage.XPDAccessData
				};

				if(!modalInstance){
					modalInstance = $uibModal.open({
	    				animation: true,
	    				size: 'sm',
	    				backdrop: false,
	    				templateUrl: 'accessFactoryDirectiveModal.html',
	                    scope: scope
	                });
				}
			}
		}

		
	}
	
})();
