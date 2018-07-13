import * as angular from 'angular';
import { IModalServiceInstance } from '../../../../../node_modules/@types/angular-ui-bootstrap';
import { PhotoAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/photo-setupapi.service';
import { ScheduleSetupAPIService } from '../../../../xpd-resources/ng/xpd.setupapi/schedule-setupapi.service';

export class UpsertMemberController {
	// 'use strict';

	// angular.module('xpd.admin')
	// 	.controller('UpsertMemberController', upsertMemberController);

	public static $inject: string[] = [
		'$scope',
		'scheduleSetupAPIService',
		'photoAPIService',
		'$uibModalInstance',
		'$member',
		'removeMemberCallback',
		'updateMemberCallback',
		'insertMemberCallback'];
	public actionButtonAdd: () => void;
	public actionButtonCancel: () => void;
	public actionButtonRemove: () => void;

	constructor(
		$scope: any,
		scheduleSetupAPIService: ScheduleSetupAPIService,
		photoAPIService: PhotoAPIService,
		$modalInstance: IModalServiceInstance,
		$member: any,
		removeMemberCallback: any,
		updateMemberCallback: any,
		insertMemberCallback: any) {

		if (!(Window as any).UpsertMemberController) {
			(Window as any).UpsertMemberController = [];
		}

		(Window as any).UpsertMemberController.push($modalInstance.close);

		$modalInstance.close = function () {
			while ((Window as any).UpsertMemberController && (Window as any).UpsertMemberController.length > 0) {
				(Window as any).UpsertMemberController.pop()();
			}
		};

		const vm = this;

		vm.actionButtonAdd = actionButtonAdd;
		vm.actionButtonCancel = actionButtonCancel;
		vm.actionButtonRemove = actionButtonRemove;
		$scope.actionSelectPhoto = actionSelectPhoto;

		$scope.modalData = angular.copy($member);

		photoAPIService.loadPhoto('tripin/member-pictures', $scope.modalData.photoPath, setImagePath);

		$scope.$watch('modalData.photoPath', function (photoPath) {

			try {

				if (photoPath != null) {
					photoAPIService.loadPhoto('tripin/member-pictures', photoPath, setImagePath);
				} else {
					if ($scope.modalData.function.id !== 1) {
						photoAPIService.loadPhoto('tripin/member-pictures', 'default', setImagePath);
					} else {
						photoAPIService.loadPhoto('tripin/member-pictures', 'team-photo', setImagePath);
					}
				}

			} catch (e) {
				// faça nada
			}

		}, true);

		$scope.$watch('modalData.identification', function (identification) {

			$scope.duplicatedIdentification = false;

			if (identification != null) {
				scheduleSetupAPIService.indentificationExists($scope.modalData.id, identification, function (exists) {
					$scope.duplicatedIdentification = exists;
				});
			}

		}, true);

		function setImagePath(imagePath) {
			$scope.imagePath = imagePath;
		}

		function actionButtonCancel() {
			$modalInstance.close();
		}

		function actionButtonAdd() {

			const member = {
				id: $scope.modalData.id || null,
				identification: $scope.modalData.identification || null,
				photoPath: $scope.modalData.photoPath || null,
				sector: 'RIG_CREW',
				function: { id: ($scope.modalData.function.functionId || $scope.modalData.function.id) },
				name: $scope.modalData.name,
			};

			if (member.id !== null) {

				scheduleSetupAPIService.updateMember(member, function (member) {
					$modalInstance.close();
					updateMemberCallback(member);
				});

			} else {

				scheduleSetupAPIService.insertMember(member, function (member) {
					$modalInstance.close();
					insertMemberCallback(member);
				});

			}

		}

		function actionButtonRemove() {

			const member = { id: $scope.modalData.id };

			scheduleSetupAPIService.removeMember(member, function (member) {
				$modalInstance.close();
				removeMemberCallback(member);
			});

		}

		function actionSelectPhoto(files) {
			const data = {}; // file object

			const fd = new FormData();
			fd.append('uploadedFile', files[0]);

			photoAPIService.uploadPhoto(fd, 'tripin/member-pictures', function (data) {
				$scope.modalData.photoPath = data.data.path;
			});

		}
	}

}
