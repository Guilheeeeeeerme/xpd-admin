import * as angular from 'angular';
import { IModalInstanceService } from 'angular-ui-bootstrap';

export class DMECChartModalController {

	public static $inject: string[] = [
		'$scope',
		'$uibModalInstance',
		'tracks',
		'onTracksChange'];

	constructor(
		$scope: any,
		$modalInstance: IModalInstanceService,
		tracks: any,
		onTracksChange: any) {

		$scope.viewData = {
			trackList: [],
		};

		$scope.viewData.trackList = angular.copy(tracks);

		$scope.actionButtonConfirm = actionButtonConfirm;
		$scope.actionButtonClose = actionButtonClose;

		function actionButtonConfirm() {

			let trackChanged = false;

			// updating tracks
			for (const i in $scope.viewData.trackList) {
				if (+tracks[i].min !== +$scope.viewData.trackList[i].min) {
					trackChanged = true;
					tracks[i].min = +$scope.viewData.trackList[i].min;
				}

				if (+tracks[i].max !== +$scope.viewData.trackList[i].max) {
					trackChanged = true;
					tracks[i].max = +$scope.viewData.trackList[i].max;
				}
			}

			localStorage.setItem('xpd.admin.dmec.dmecTracks', JSON.stringify(tracks));

			if (trackChanged) {
				onTracksChange();
			}

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}
}
