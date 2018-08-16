import * as angular from 'angular';
import { IModalServiceInstance } from 'angular-ui-bootstrap';
import { DialogService } from '../../../../shared/xpd.dialog/xpd.dialog.factory';
import { PhotoAPIService } from '../../../../shared/xpd.setupapi/photo-setupapi.service';
import { ScheduleSetupAPIService } from '../../../../shared/xpd.setupapi/schedule-setupapi.service';

export class UpsertMemberController {

	public static $inject: string[] = [
		'$scope',
		'scheduleSetupAPIService',
		'photoAPIService',
		'dialogService',
		'$uibModalInstance',
		'$member',
		'removeMemberCallback',
		'updateMemberCallback',
		'insertMemberCallback'];

	constructor(
		private $scope: any,
		private scheduleSetupAPIService: ScheduleSetupAPIService,
		private photoAPIService: PhotoAPIService,
		private dialogService: DialogService,
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

		$scope.actionSelectPhoto = (data) => { this.actionSelectPhoto(data); };

		this.$scope.imagePathSet = false;
		photoAPIService.loadPhoto('tripin/member-pictures', $scope.modalData.photoPath).then((data) => { this.setImagePath(data); });

		$scope.$watch('modalData.photoPath', (photoPath) => {
			this.$scope.imagePathSet = false;

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

		this.dialogService.showCriticalDialog(
			'Are you sure you want to ' + ((member.id !== null) ? 'update' : 'insert') +
			' the ' + ((this.$scope.modalData.function.id !== 1) ? 'member' : 'team') +
			' ' + member.name + '?',
			() => {

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

			});

	}

	public actionButtonRemove() {

		const member = { id: this.$scope.modalData.id };

		this.dialogService.showCriticalDialog(
			'Are you sure you want to delete the ' + ((this.$scope.modalData.function.id !== 1) ? 'member' : 'team') +
			' ' + this.$scope.modalData.name + '?',
			() => {
				this.scheduleSetupAPIService.removeMember(member).then((member1) => {
					this.$modalInstance.close();
					this.removeMemberCallback(member1);
				});
			});
	}

	private actionSelectPhoto(files) {

		const file = files[0];

		const fd = new FormData();
		fd.append('uploadedFile', file);

		console.log(fd, file);
		this.photoAPIService.uploadPhoto(fd, 'tripin/member-pictures').then((data1: any) => {
			console.log(data1);
			this.$scope.modalData.photoPath = data1.data.path;
		});

	}
	private setImagePath(imagePath) {
		imagePath = 'data:image/png;base64, ' + imagePath;
		this.$scope.imagePath = imagePath;
		this.$scope.imagePathSet = true;
	}

}
