import { SectionSetupAPIService } from '../../../shared/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../../shared/xpd.setupapi/well-setupapi.service';

export class WellViewOnlyController {

	public static $inject = ['$scope', '$routeParams', 'wellSetupAPIService', 'sectionSetupAPIService'];

	constructor(
		private $scope: any,
		$routeParams: ng.route.IRouteParamsService,
		wellSetupAPIService: WellSetupAPIService,
		sectionSetupAPIService: SectionSetupAPIService) {

		const vm = this;

		$routeParams.wellId = +$routeParams.wellId;
		const wellId = $routeParams.wellId;

		$scope.dados = {
			well: null,
			sectionList: [],
		};

		wellSetupAPIService.getObjectById(wellId).then((well: any) => {
			vm.loadWellCallback(well);
		}, () => {
			vm.loadWellErrorCallback();
		});

		sectionSetupAPIService.getListOfSectionsByWell(wellId).then((sectionList) => {
			vm.loadSectionListCallback(sectionList);
		});
	}

	private loadWellCallback(data) {
		this.$scope.dados.currentWell = data;
	}

	private loadSectionListCallback(sectionList) {
		this.$scope.dados.sectionList = sectionList;
	}

	private loadWellErrorCallback() {
		console.log('Error loading Well!');
	}
}
