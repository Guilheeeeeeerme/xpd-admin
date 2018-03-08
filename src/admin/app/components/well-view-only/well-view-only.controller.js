(function () {
	'use strict';

	angular.module('xpd.wellviewonly').controller('WellViewOnlyController', wellViewOnlyController);

	wellViewOnlyController.$inject = ['$scope', 'setupAPIService', 'wellSetupAPIService', 'operationSetupAPIService'];

	function wellViewOnlyController($scope, setupAPIService, wellSetupAPIService, operationSetupAPIService) {

		var queryDict = {};
		location.search.substr(1).split('&').forEach(function (item) {
			queryDict[item.split('=')[0]] = item.split('=')[1];
		});

		var wellId = queryDict.wellid;

		$scope.dados = {
			well: null,
			sectionList: []
		};

		setupAPIService.getObjectById('setup/well', wellId, function(response){
			loadWellCallback(response.data);
		}, 
		loadWellErrorCallback);

		wellSetupAPIService.getListOfSectionsByWell(wellId, loadSectionListCallback);

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
})();