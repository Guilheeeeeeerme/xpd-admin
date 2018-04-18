(function () {
	'use strict';

	angular.module('xpd.dmeclog')
		.controller('ModalChangeScaleController', ModalChangeScaleController);

	ModalChangeScaleController.$inject = ['$scope', '$uibModalInstance', 'tracks'];

	function ModalChangeScaleController($scope, $modalInstance, tracks) {

		$scope.viewData = {
			trackList: []
		};

		$scope.viewData.trackList = angular.copy(tracks);

		$scope.actionButtonConfirm = actionButtonConfirm;
		$scope.actionButtonClose = actionButtonClose;

		function actionButtonConfirm() {

			// updating tracks
			for (var i in $scope.viewData.trackList) {
				if (+tracks[i].min != +$scope.viewData.trackList[i].min) {
					tracks[i].min = +$scope.viewData.trackList[i].min;
				}

				if (+tracks[i].max != +$scope.viewData.trackList[i].max) {
					tracks[i].max = +$scope.viewData.trackList[i].max;
				}
			}

			localStorage.dmecTracks = JSON.stringify(tracks);

			$modalInstance.close();
		}

		function actionButtonClose() {
			$modalInstance.close();
		}
	}
})();