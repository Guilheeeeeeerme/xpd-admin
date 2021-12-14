import { WitsDataService } from './../../../shared/xpd.wits-data/wits-data.service';
import { OperationDataService } from '../../../shared/xpd.operation-data/operation-data.service';
import configureMeasurements,  {allMeasures}  from 'convert-units';
var customMeasures = require('./custom-measures');
var convert = configureMeasurements(allMeasures);
var convertCustom = configureMeasurements(customMeasures);
export class DataAcquisitionController {

	// 'use strict';

	// 	.controller('DataAcquisitionController', dataAcquisitionController);
	// private loadServerInfo() {

	// 	this.$scope.dados.sectionList = [];

	// 	if (this.$routeParams.wellId != null) {
	// 		this.sectionSetupAPIService.getListOfSectionsByWell(this.$routeParams.wellId).then((sectionList) => {
	// 			this.$scope.dados.sectionList = this.$filter('orderBy')(sectionList, 'sectionOrder');
	// 		});
	// 	}

	// }

	public static $inject = ['$scope', '$rootScope', 'operationDataService', 'witsDataService'];
	public changeViewAcquisition: () => void;
	public openModalTranslatorConfig: () => void;
	public changeFilterField: () => void;
	public actionBuildSubmetric: (data: any) => void;
	public closeModal: () => void;
	public actionButtonUpdateMapping: () => void;
	public changeViewReading: () => void;
	public resetForm: (connType) => void;
	public actionButtonConnect: () => void;
	public actionButtonDisconnect: () => void;
	public update: (data: any) => void;
	public operationDataFactory: any;
	public witsDataFactory: any;

	constructor($scope, $rootScope, operationDataService: OperationDataService, witsDataService: WitsDataService) {

		const vm = this;
		var submetricsTemp;
		$scope.master = {};
		$scope.wits = {};
		$scope.item = {};
		$scope.serverInfo = {};
		$scope.new = {};
		$scope.dadosWits = [];
		$scope.dados = {
			isConnected: false,
			acquisitionJson: false,
			readingJson: false,
			readingData: {}
		};

		//Mapping
		const defaultMeasures = convert().measures();
		const customMeasures = convertCustom().measures()
		$scope.allMetrics = customMeasures.concat(defaultMeasures)

		$scope.sortRec = {
			rec: '',
			item: '',
			description: ''
		};
		$scope.fields = [
			'rpm',
			'wob',
			'rop',
			'flow',
			'torque',
			'depth',
			'blockPosition',
			'hookload',
			'sppa',
			'bitDepth',
			'blockSpeed',
			'date',
			'time'
		];
		// vm.openModalTranslatorConfig = openModalTranslatorConfig;
		vm.actionButtonConnect = actionButtonConnect;
		vm.changeFilterField = changeFilterField;
		vm.actionBuildSubmetric = actionBuildSubmetric;
		vm.actionButtonDisconnect = actionButtonDisconnect;
		vm.changeViewAcquisition = changeViewAcquisition;
		vm.actionButtonUpdateMapping = actionButtonUpdateMapping;
		vm.update = update;
		vm.closeModal = closeModal;
		vm.resetForm = resetForm;
		vm.changeViewReading = changeViewReading;


		function onAcquisitionDetails(details) {
			details.mapped = witsDataService.readingLineToJson(details.readingLine, $scope.mapping);
			details.rawData = details.wits;
			details.wits = witsDataService.readingWitsToJson(details.wits);
			details.line = witsDataService.merge(details.readingLine);
			$scope.dadosWits.unshift(details);
			if ($scope.dadosWits.length == 50) {
				$scope.dadosWits.pop();
			}

			$scope.$apply();
		}

		function hasConnection(serverInfo) {
			$scope.serverInfo = serverInfo;
			$scope.$apply();
		}

		operationDataService.openConnection(['reading', 'dataAcquisition']).then(function () {
			vm.operationDataFactory = operationDataService.operationDataFactory;
			$scope.readingData = vm.operationDataFactory.operationData.readingContext;
			$scope.acquisitionData = vm.operationDataFactory.operationData.dataAcquisitionContext;
		});


		witsDataService.openConnection(['mapping', 'dataAcquisition']).then(() => {
			vm.witsDataFactory = witsDataService.witsDataFactory;
			$scope.witsReadingData = vm.witsDataFactory.operationData;
			witsDataService.on('acquisition-details', (arg) => onAcquisitionDetails(arg));
			witsDataService.on('server-info', (serverInfo) => hasConnection(serverInfo))
		}).catch(e => {
			console.log('log erro', e)
		});

		function actionButtonConnect() {
			if ($rootScope.serverInfo.serialPort){
				$rootScope.serverInfo.serialPort = $rootScope.serverInfo.serialPort.trim();
			}
			witsDataService.emitEv('user-request-connection', $rootScope.serverInfo);
		}

		function actionButtonDisconnect() {
			witsDataService.emitEv('user-request-disconnection', $rootScope.serverInfo)
		}

		function changeViewAcquisition() {
			if ($scope.dados.acquisitionJson) {
				$scope.dados.acquisitionJson = false;
			} else {
				$scope.dados.acquisitionJson = true;
			}
		}

		function changeFilterField() {
			if ($scope.filterField == true) {
				$scope.filterField = false;
				$scope.sortRec.rec = '01';
			} else {
				$scope.filterField = true;
				$scope.sortRec.rec = '';
			}
		}

		function actionBuildSubmetric(measure) {
			if (!measure) {
				return [];
			}

			if (!submetricsTemp) {
				submetricsTemp = {};
			}

			if (!submetricsTemp[measure]) {
				
				if (convert().measures().indexOf(measure) > -1) {
					submetricsTemp[measure] = convert().list(measure) || [];
				} else{
					submetricsTemp[measure] = convertCustom().list(measure) || [];
				}
			}

			return submetricsTemp[measure];
		}

		function update(newMap) {
			witsDataService.addMapping(newMap);
		}

		function closeModal() {
			$scope.new = {
			}
		}

		function actionButtonUpdateMapping() {
			witsDataService.emitEv('user-update-mapping', $scope.mapping.map(function (map) {

				delete map.$$hashKey;
				delete map.possibilities;
				return map;
			}))
		}

		function changeViewReading() {
			if ($scope.dados.readingJson) {
				$scope.dados.readingJson = false;
			} else {
				$scope.dados.readingJson = true;
			}
		}

		function resetForm(connectionType) {
			$scope.wits = {
				connectionType: connectionType,
				address: null,
				port: null,
				serialPort: null
			};
		}
	}
}

