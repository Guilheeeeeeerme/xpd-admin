(function () {
	'use strict';

	angular.module('xpd.admin').controller('TeamController', teamController);

	teamController.$inject = ['$scope', 'setupAPIService'];

	function teamController($scope, setupAPIService) {

		$scope.team = {
			members: [],
			teams: []
		};

		setupAPIService.getList('setup/member-score', function (members) {
			members = members.data;
			
			$scope.team.teams = members.filter(function(member){
				return member.function.id == 1;
			});

			$scope.team.members = members.filter(function(member){
				return member.function.id != 1;
			});

		});

	}

})();
