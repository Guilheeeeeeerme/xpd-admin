export class OperationConfigurationService {
	// 'use strict';

	public static $inject = ['$sce'];

	private casingTripSpeedParams = {
		casing12SemiFlush: { voptimum: 14, vstandard: 12, vpoor: 8, contractIndicator: true },
		casing12Flush: { voptimum: 12, vstandard: 10, vpoor: 6, contractIndicator: true },
		casing16SemiFlush: { voptimum: 12, vstandard: 10, vpoor: 6, contractIndicator: true },
		casing16Flush: { voptimum: 10, vstandard: 8, vpoor: 4, contractIndicator: true },
		casing24: { voptimum: 7, vstandard: 5.8, vpoor: 3.5, contractIndicator: true },
		casing24Plus: { voptimum: 2, vstandard: 1.5, vpoor: 0.5, contractIndicator: true },
	};

	private riserTripSpeedParams = {
		descendRiser: { voptimum: 95, vstandard: 80, vpoor: 50, contractIndicator: true },
		ascentRiser: { voptimum: 105, vstandard: 88, vpoor: 55, contractIndicator: true },
	};

	constructor(private $sce) { }

	public getCasingTypeSizeItems(): Array<{ /*id: 1,*/ label: string; id: string; }> {
		const casingTypeSizeItems = [
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

	public getRiserTripSpeedParams(metaTypeId) {
		return this.riserTripSpeedParams['' + metaTypeId];
	}

	public getCasingTripSpeedParams(casingTypeId) {
		return this.casingTripSpeedParams['' + casingTypeId];
	}

	public getOperationViewTabs(operation): Array<{ title: string; url: string; }> {

		if (operation.running) {
			return [
				{
					title: 'Operation Info',
					url: operation.type + '-general-info.template.html',
				},
			];
		} else {
			return [
				{
					title: 'Operation Info',
					url: operation.type + '-general-info.template.html',
				}, {
					title: 'Contract Performance',
					url: operation.type + '-contract-info.template.html',
				}, {
					title: 'Alarms', url: 'alarm-info.template.html',
				},
			];
		}
	}

	public getHtmlSlipsThreshold() {
		return this.$sce.trustAsHtml('<p>If <u>Hook load</u> is greater than <u>Block Weight</u> + <u>Slips Threshold</u><br>' +
			'than activity will be a <b>Connection</b></p>');
	}

	public getImageAceleration() {
		return this.$sce.trustAsHtml('<img class="img-responsible image_acceleration" width="200px" height="auto" >');
	}

}
