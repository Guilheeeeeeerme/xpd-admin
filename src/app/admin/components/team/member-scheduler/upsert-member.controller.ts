import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { PhotoAPIService } from '../../../../shared/xpd.setupapi/photo-setupapi.service';
import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';

export class UpsertMemberController {
	// 'use strict';

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

	constructor(
		private $scope: any,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private photoAPIService: PhotoAPIService,
		private $modalInstance: IModalServiceInstance,
		private $member: any,
		private removeMemberCallback: any,
		private updateMemberCallback: any,
		private insertMemberCallback: any) {

		if (!(Window as any).UpsertMemberController) {
			(Window as any).UpsertMemberController = [];
		}

		(Window as any).UpsertMemberController.push($modalInstance.close);

		$modalInstance.close = () => {
			while ((Window as any).UpsertMemberController && (Window as any).UpsertMemberController.length > 0) {
				(Window as any).UpsertMemberController.pop()();
			}
		};

		const vm = this;

		$scope.modalData = angular.copy($member);

		photoAPIService.loadPhoto('tripin/member-pictures', $scope.modalData.photoPath).then((data) => { this.setImagePath(data); });

		$scope.$watch('modalData.photoPath', (photoPath) => {

			try {

				if (photoPath != null) {
					photoAPIService.loadPhoto('tripin/member-pictures', photoPath).then((arg) => { vm.setImagePath(arg); });
				} else {
					if ($scope.modalData.function.id !== 1) {
						photoAPIService.loadPhoto('tripin/member-pictures', 'default').then((arg) => { vm.setImagePath(arg); });
					} else {
						photoAPIService.loadPhoto('tripin/member-pictures', 'team-photo').then((arg) => { vm.setImagePath(arg); });
					}
				}

			} catch (e) {
				// faça nada
			}

		}, true);

		$scope.$watch('modalData.identification', (identification) => {

			$scope.duplicatedIdentification = false;

			if (identification != null) {
				scheduleSetupAPIService.indentificationExists($scope.modalData.id, identification).then((exists) => {
					$scope.duplicatedIdentification = exists;
				});
			}

		}, true);

	}
	private setImagePath(imagePath) {
		this.$scope.imagePath = imagePath;
	}

	public actionButtonCancel() {
		this.$modalInstance.close();
	}

	public actionButtonAdd() {

		const member = {
			id: this.$scope.modalData.id || null,
			identification: this.$scope.modalData.identification || null,
			photoPath: this.$scope.modalData.photoPath || null,
			sector: 'RIG_CREW',
			function: { id: (this.$scope.modalData.function.functionId || this.$scope.modalData.function.id) },
			name: this.$scope.modalData.name,
		};

		if (member.id !== null) {

			this.scheduleSetupAPIService.updateMember(member).then((member1) => {
				this.$modalInstance.close();
				this.updateMemberCallback(member1);
			});

		} else {

			this.scheduleSetupAPIService.insertMember(member).then((member1) => {
				this.$modalInstance.close();
				this.insertMemberCallback(member1);
			});

		}

	}

	public actionButtonRemove() {

		const member = { id: this.$scope.modalData.id };

		this.scheduleSetupAPIService.removeMember(member).then((member1) => {
			this.$modalInstance.close();
			this.removeMemberCallback(member1);
		});

	}

	public actionSelectPhoto(files) {
		const data = {}; // file object

		const fd = new FormData();
		fd.append('uploadedFile', files[0]);

		this.photoAPIService.uploadPhoto(fd, 'tripin/member-pictures').then((data1: any) => {
			this.$scope.modalData.photoPath = data1.data.path;
		});

	}

}
