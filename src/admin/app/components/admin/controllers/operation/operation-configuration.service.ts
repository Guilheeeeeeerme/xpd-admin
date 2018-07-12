(function() {
	'use strict';

	angular.module('xpd.admin').service('OperationConfigurationService', operationConfigurationService);

	operationConfigurationService.$inject = ['$sce'];

	function operationConfigurationService($sce) {
		let vm = this;

		vm.getCasingTypeSizeItems = getCasingTypeSizeItems;
		vm.getHtmlPopOver = getHtmlPopOver;
		vm.getHtmlSlipsThreshold = getHtmlSlipsThreshold;
		vm.getOperationViewTabs = getOperationViewTabs;

		vm.getCasingTripSpeedParams = getCasingTripSpeedParams;
		vm.getRiserTripSpeedParams = getRiserTripSpeedParams;

		let casingTripSpeedParams = {
			casing12SemiFlush: { voptimum: 14, vstandard: 12, vpoor: 8, contractIndicator: true },
			casing12Flush: { voptimum: 12, vstandard: 10, vpoor: 6, contractIndicator: true },
			casing16SemiFlush: { voptimum: 12, vstandard: 10, vpoor: 6, contractIndicator: true },
			casing16Flush: { voptimum: 10, vstandard: 8, vpoor: 4, contractIndicator: true },
			casing24: { voptimum: 7, vstandard: 5.8, vpoor: 3.5, contractIndicator: true },
			casing24Plus: { voptimum: 2, vstandard: 1.5, vpoor: 0.5, contractIndicator: true },
		};

		let riserTripSpeedParams = {
			descendRiser: { voptimum: 95, vstandard: 80, vpoor: 50, contractIndicator: true },
			ascentRiser: { voptimum: 105, vstandard: 88, vpoor: 55, contractIndicator: true },
		};

		function getCasingTypeSizeItems() {
			let casingTypeSizeItems = [
				{/*id: 1,*/ label: 'Less than 12" semi flush or conventinal', id: 'casing12SemiFlush' },
				{/*id: 2,*/ label: 'Less than 12" flush', id: 'casing12Flush' },
				{
					/*id: 3,*/
					label: 'Greater than or equal to 12" and smaller than 16" semi flush or conventional',
					id: 'casing16SemiFlush',
				},
				{/*id: 4,*/ label: 'Greater than or equal to 12" and smaller than 16" flush', id: 'casing16Flush' },
				{/*id: 5,*/ label: 'Greater than or equal to 16" and smaller than 24"', id: 'casing24' },
				{/*id: 6,*/ label: 'Greater than or equal to 24"', id: 'casing24Plus' },
			];

			return casingTypeSizeItems;
		}

		function getCasingTripSpeedParams(casingTypeId) {
			return casingTripSpeedParams['' + casingTypeId];
		}

		function getRiserTripSpeedParams(metaTypeId) {
			return riserTripSpeedParams['' + metaTypeId];
		}

		function getOperationViewTabs(operation) {

			if (operation.running) {
				return [
					{
						title: 'Operation Info',
						url: './app/components/admin/views/forms/' + operation.type + '-general-info.template.html',
					},
				];
			} else {
				return [
					{
						title: 'Operation Info',
						url: './app/components/admin/views/forms/' + operation.type + '-general-info.template.html',
					},
					{
						title: 'Contract Performance',
						url: './app/components/admin/views/forms/' + operation.type + '-contract-info.template.html',
					},
					{ title: 'Alarms', url: './app/components/admin/views/forms/alarm-info.template.html' },
				];
			}
		}

		function getHtmlPopOver() {
			return $sce.trustAsHtml('<img class="img-responsible" width="200px" height="auto" src="../xpd-resources/img/imagem_acceleration.png">');
		}

		function getHtmlSlipsThreshold() {
			return $sce.trustAsHtml('<p>If <u>Hook load</u> is greater than <u>Block Weight</u> + <u>Slips Threshold</u><br>' +
				'than activity will be a <b>Connection</b></p>');
		}
	}
})();
