import { SectionSetupAPIService } from '../../xpd-resources/ng/xpd.setupapi/section-setupapi.service';
import { WellSetupAPIService } from '../../xpd-resources/ng/xpd.setupapi/well-setupapi.service';

export class WellViewOnlyController {

	public static $inject = ['$scope', 'wellSetupAPIService', 'sectionSetupAPIService'];

	constructor(
		$scope: any,
		wellSetupAPIService: WellSetupAPIService,
		sectionSetupAPIService: SectionSetupAPIService) {

		const queryDict: any = {};
		location.search.substr(1).split('&').forEach(function (item) {
			queryDict[item.split('=')[0]] = item.split('=')[1];
		});

		const wellId = queryDict.wellid;

		$scope.dados = {
			well: null,
			sectionList: [],
		};

		wellSetupAPIService.getObjectById(wellId, function (well) {
			loadWellCallback(well);
		},
			loadWellErrorCallback);

		sectionSetupAPIService.getListOfSectionsByWell(wellId, loadSectionListCallback);

		function loadWellCallback(data) {
			$scope.dados.currentWell = data;
		}

		function loadSectionListCallback(sectionList) {
			$scope.dados.sectionList = sectionList;
		}

		function loadWellErrorCallback() {
			console.log('Error loading Well!');
		}
	}
}
