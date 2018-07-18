import { ScheduleSetupAPIService } from '../../../shared/xpd.setupapi/schedule-setupapi.service';

export class TeamController {
	// 'use strict';

	public static $inject = ['$scope', 'scheduleSetupAPIService'];

	constructor(
		private $scope: any,
		private scheduleSetupAPIService: ScheduleSetupAPIService) {

		$scope.team = {
			members: [],
			teams: [],
		};

		scheduleSetupAPIService.getMemberScore().then((members: any) => {

			$scope.team.teams = members.filter((member) => {
				return member.function.id === 1;
			});

			$scope.team.members = members.filter((member) => {
				return member.function.id !== 1;
			});

		});

	}

}
