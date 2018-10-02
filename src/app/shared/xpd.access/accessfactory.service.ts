import { IModalService } from 'angular-ui-bootstrap';
import template from '../xpd.access/accessfactory-form.template.html';

export class AccessFactoryService {

	public static $inject: string[] = ['$uibModal', '$window', 'dialogService', 'authService', 'xpdAccessService'];
	private modalInstance: any;

	constructor(private $uibModal: IModalService) {}

	public actionButtonEditAccessData () {
		console.log('actionButtonEditAccessData');

		if (!this.modalInstance) {
			this.modalInstance = this.$uibModal.open({
				animation: true,
				size: 'lg',
				backdrop: false,
				controller: 'AccessFactoryModalController as accessFactoryController',
				template: template,
				resolve: {
					actionButtonCancel: () => {
						return () => {
							this.modalInstance.close();
							this.modalInstance = null;
						};
					},
				},
			});
		}
	}

}

// })();
