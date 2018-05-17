(function () {
	'use strict';

	angular.module('xpd.wellviewonly').controller('WellViewOnlyController', wellViewOnlyController);

	wellViewOnlyController.$inject = ['$scope', 'wellSetupAPIService'];

	function wellViewOnlyController($scope, wellSetupAPIService) {

		var queryDict = {};
		location.search.substr(1).split('&').forEach(function (item) {
			queryDict[item.split('=')[0]] = item.split('=')[1];
		});

		var wellId = queryDict.wellid;

		$scope.dados = {
			well: null,
			sectionList: []
		};

		wellSetupAPIService.getObjectById(wellId, function(well){
			loadWellCallback(well);
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