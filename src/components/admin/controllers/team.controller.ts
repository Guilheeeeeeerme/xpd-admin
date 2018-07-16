import { ScheduleSetupAPIService } from '../../../app/shared/xpd.setupapi/schedule-setupapi.service';

export class TeamController {
	// 'use strict';

	// angular.module('xpd.admin').controller('TeamController', teamController);

	public static $inject = ['$scope', 'scheduleSetupAPIService'];

	constructor ($scope, scheduleSetupAPIService: ScheduleSetupAPIService) {

		$scope.team = {
			members: [],
			teams: [],
		};

		scheduleSetupAPIService.getMemberScore(function(members) {

			$scope.team.teams = members.filter(function(member) {
				return member.function.id === 1;
			});

			$scope.team.members = members.filter(function(member) {
				return member.function.id !== 1;
			});

		});

	}

}
