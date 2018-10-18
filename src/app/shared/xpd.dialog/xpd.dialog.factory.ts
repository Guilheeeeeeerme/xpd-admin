import { IModalService } from 'angular-ui-bootstrap';
import './xpd.dialog.style.scss';

// (function() {
// 	'use strict';

// 		.factory('dialogService', dialogService);

// 	dialogService.$inject = ['$uibModal'];

export class DialogService {

	public static readonly MESSAGE_DIALOG = 'MESSAGE_DIALOG';
	public static readonly CONFIRM_DIALOG = 'CONFIRM_DIALOG';
	public static readonly CRITICAL_DIALOG = 'CRITICAL_DIALOG';

	public static $inject: string[] = ['$uibModal'];

	constructor(private $modal: IModalService) {

	}

	public showMessageDialog(message, title?, callback?) {

		// template: generateModalTemplate(title, message, MESSAGE_DIALOG);

		title = (!title) ? 'Message' : title;

		message = this.processMessage(message);

		const modalOptions = this.generateModalOptions(message, callback, null);

		this.addContentToModal(modalOptions, title, message, DialogService.MESSAGE_DIALOG);

		this.$modal.open(modalOptions);
	}

	public showConfirmDialog(message, confirmCallback?, cancelCallback?) {

		// 	template: generateModalTemplate('Confirmation', message, CONFIRM_DIALOG)

		message = this.processMessage(message);

		const modalOptions = this.generateModalOptions(message, confirmCallback, cancelCallback);

		this.addContentToModal(modalOptions, 'Confirmation', message, DialogService.CONFIRM_DIALOG);

		this.$modal.open(modalOptions);
	}

	public showCriticalDialog(message, confirmCallback?, cancelCallback?) {

		// 	template: generateModalTemplate('Critical Confirmation', message, CRITICAL_DIALOG);

		message = this.processMessage(message);

		const modalOptions = this.generateModalOptions(message, confirmCallback, cancelCallback);

		this.addContentToModal(modalOptions, 'Critical Confirmation', message, DialogService.CRITICAL_DIALOG);

		this.$modal.open(modalOptions);
	}

	private processMessage(content) {

		if (!content) {
			content = {
				message: 'Empty Dialog',
			};
		} else {
			if (content && typeof content === 'string') {
				content = {
					message: content,
				};
			}
		}

		return content;
	}

	private addContentToModal(modalOptions, title, content, type) {
		modalOptions.template = this.generateModalTemplate(title, content, type);
	}

	private generateModalOptions(content, confirmCallback, cancelCallback) {
		return {
			keyboard: false,
			backdrop: 'static',
			controller: 'dialogController',
			resolve: {
				confirmCallback() {
					return confirmCallback;
				},
				cancelCallback() {
					return cancelCallback;
				},
				content() {
					return content;
				},
			},
		};
	}

	private generateModalTemplate(title, content, type) {
		let header;
		if (type === DialogService.CRITICAL_DIALOG) {
			header = '<div class="modal-header alert alert-danger">' +
				'<h3 class="modal-title">' + title + '</h3>' +
				'</div>';
		} else {
			header = '<div class="modal-header">' +
				'<h3 class="modal-title">' + title + '</h3>' +
				'</div>';
		}

		let body = '';

		if (type === DialogService.CRITICAL_DIALOG) {
			body += '<div class="modal-body xpd-modal-body-critical">';
		} else if (type === DialogService.CONFIRM_DIALOG) {
			body += '<div class="modal-body xpd-modal-body-confirm">';
		} else {
			body += '<div class="modal-body xpd-modal-body-message">';
		}

		if (content.templateHtml) {
			body += '<div>' + content.templateHtml + '</div>';
		} else {
			body += '<p>{{content.message}}</p>';
		}

		body += '</div>';

		let footer = '<div class="modal-footer">';

		if (type === DialogService.MESSAGE_DIALOG) {

			footer += '<div class="col-xs-12 text-center">' +
				'<button class="btn-modal btn-primary" type="button" ng-click="actionButtonYes()">OK</button>' +
				'</div>';

		} else if (type === DialogService.CONFIRM_DIALOG || type === DialogService.CRITICAL_DIALOG) {
			footer += '<div class=" col-xs-6 text-center">' +
				'<button id="confirm" class="btn-modal btn-primary" type="button" ng-click="actionButtonYes()">YES</button>' +
				'</div>' +
				'<div class=" col-xs-6 text-center">' +
				'<button id="deny" class="btn-modal btn-warning" type="button" ng-click="actionButtonNo()">NO</button>' +
				'</div>';
		}

		footer += '</div>';

		let modalContent = '';

		if (type === DialogService.CRITICAL_DIALOG) {
			modalContent += '<div class="modal-content xpd-modal-content-critical">';
		} else if (type === DialogService.CONFIRM_DIALOG) {
			modalContent += '<div class="modal-content xpd-modal-content-confirm">';
		} else {
			modalContent += '<div class="modal-content xpd-modal-content-message">';
		}

		modalContent += header;
		modalContent += body;
		modalContent += footer;
		modalContent += '</div>';

		return modalContent;
	}

}

	// })();
