(function() {
	'use strict';

	angular.module('xpd.admin').controller('TeamController', teamController);

	teamController.$inject = ['$scope', 'scheduleSetupAPIService'];

	function teamController($scope, scheduleSetupAPIService) {

		$scope.team = {
			members: [],
			teams: [],
		};

		scheduleSetupAPIService.getMemberScore(function(members) {

			$scope.team.teams = members.filter(function(member) {
				return member.function.id == 1;
			});

			$scope.team.members = members.filter(function(member) {
				return member.function.id != 1;
			});

		});

	}

})();
