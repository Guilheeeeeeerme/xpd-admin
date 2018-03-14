(function () {
	'use strict';

	angular.module('xpd.admin')
		.controller('UpsertMemberController', upsertMemberController);

	upsertMemberController.$inject = [
		'$scope', 
		'setupAPIService', 
		'photoAPIService', 
		'scheduleSetupAPIService', 
		'$uibModalInstance', 
		'$member', 
		'removeMemberCallback', 
		'updateMemberCallback', 
		'insertMemberCallback'];

	function upsertMemberController($scope, setupAPIService, photoAPIService, scheduleSetupAPIService, $modalInstance, $member, removeMemberCallback, updateMemberCallback, insertMemberCallback) {

		if(!Window.UpsertMemberController)
			Window.UpsertMemberController = [];

		Window.UpsertMemberController.push($modalInstance.close);

		$modalInstance.close = function(){
			while(Window.UpsertMemberController && Window.UpsertMemberController.length > 0){
				Window.UpsertMemberController.pop()();
			}
		};

		var vm = this;

		vm.actionButtonAdd = actionButtonAdd;
		vm.actionButtonCancel = actionButtonCancel;
		vm.actionButtonRemove = actionButtonRemove;
		$scope.actionSelectPhoto = actionSelectPhoto;

		$scope.modalData = angular.copy($member);
		
		photoAPIService.loadPhoto('tripin/member-pictures', $scope.modalData.photoPath, setImagePath);
		
		$scope.$watch('modalData.photoPath', function (photoPath) {

			try{

				if (photoPath != null)
					photoAPIService.loadPhoto('tripin/member-pictures', photoPath, setImagePath);
				else{
					if($scope.modalData.function.id != 1)
						photoAPIService.loadPhoto('tripin/member-pictures', 'default', setImagePath);
					else
						photoAPIService.loadPhoto('tripin/member-pictures', 'team-photo', setImagePath);
				}
			
			}catch(e){

			}
			
		}, true);

		$scope.$watch('modalData.identification', function (identification) {

			$scope.duplicatedIdentification = false;
			
			if (identification != null){
				scheduleSetupAPIService.indentificationExists($scope.modalData.id, identification, function(exists){
					$scope.duplicatedIdentification = exists;
				});
			}

		}, true);

		function setImagePath(imagePath){
			$scope.imagePath = imagePath;
		}

		function actionButtonCancel() {
			$modalInstance.close();
		}

		function actionButtonAdd() {

			var member = {
				id: $scope.modalData.id || null,
				identification: $scope.modalData.identification || null,
				photoPath: $scope.modalData.photoPath || null,
				sector: 'RIG_CREW',
				function: { id: ($scope.modalData.function.functionId || $scope.modalData.function.id) },
				name: $scope.modalData.name,
			};

			if (member.id !== null) {

				setupAPIService.updateObject('setup/member', member, function(response){
					member = response.data;
					$modalInstance.close();
					updateMemberCallback(member);
				});

			} else {

				setupAPIService.insertObject('setup/member', member, function(response){
					member = response.data;
					$modalInstance.close();
					insertMemberCallback(member);
				});
				
			}

		}

		function actionButtonRemove() {

			var member = {id: $scope.modalData.id};
			
			setupAPIService.removeObject('setup/member', member, function(response){
				member = response.data;
				$modalInstance.close();
				removeMemberCallback(member);
			});
			
		}

		function actionSelectPhoto(files) {
			var data = {}; //file object 

			var fd = new FormData();
			fd.append('uploadedFile', files[0]);

			photoAPIService.uploadPhoto(fd, 'tripin/member-pictures', function (data) {
				$scope.modalData.photoPath = data.data.path;
			});

		}
	}

})();
