(function () {
	'use strict';

	angular.module('xpd.dialog')
		.factory('dialogFactory', dialogFactory)
		.controller('dialogController', dialogController);


	dialogController.$inject = ['$scope', '$uibModalInstance', 'content', 'confirmCallback', 'cancelCallback'];

	function dialogController($scope, $uibModalInstance, content,confirmCallback, cancelCallback) {

		$scope.content = content;

		$scope.confirmCallback = confirmCallback;
		$scope.cancelCallback = cancelCallback;

		$scope.actionButtonYes = function () {
			$uibModalInstance.close();
			confirmCallback && confirmCallback();
		};

		$scope.actionButtonNo = function () {
			$uibModalInstance.close();
			cancelCallback && cancelCallback();
		};
	}


	dialogFactory.$inject = ['$uibModal', '$sce'];

	function dialogFactory($modal, $sce) {

		var MESSAGE_DIALOG = 'MESSAGE_DIALOG';
		var CONFIRM_DIALOG = 'CONFIRM_DIALOG';
		var CRITICAL_DIALOG = 'CRITICAL_DIALOG';

		function showMessageDialog(message, title, callback) {

			// template: generateModalTemplate(title, message, MESSAGE_DIALOG);
	
			message = processMessage(message);

			var modalOptions = generateModalOptions(message, callback, null);

			addContentToModal(modalOptions, title, message, MESSAGE_DIALOG);

			$modal.open(modalOptions);
		}

		function showConfirmDialog(message, confirmCallback, cancelCallback) {

			//	template: generateModalTemplate('Confirmation', message, CONFIRM_DIALOG)

			message = processMessage(message);

			var modalOptions = generateModalOptions(message, confirmCallback, cancelCallback);

			addContentToModal(modalOptions, 'Confirmation', message, CONFIRM_DIALOG);

			$modal.open(modalOptions);
		}

		function showCriticalDialog(message, confirmCallback, cancelCallback) {

			//	template: generateModalTemplate('Critical Confirmation', message, CRITICAL_DIALOG);

			message = processMessage(message);

			var modalOptions = generateModalOptions(message, confirmCallback, cancelCallback);

			addContentToModal(modalOptions, 'Critical Confirmation', message, CRITICAL_DIALOG);

			$modal.open(modalOptions);
		}

		function processMessage(content){

			if(!content){
				content = {
					message: 'Empty Dialog'
				};
			}else{
				if(content && typeof content == 'string'){
					content = {
						message: content
					};
				}
			}

			return content;
		}

		function addContentToModal(modalOptions, title, content, type){
			modalOptions.template = generateModalTemplate(title, content, type);
		}

		function generateModalOptions(content, confirmCallback, cancelCallback){
			return {
				keyboard: false,
				backdrop: 'static',
				controller: 'dialogController',
				resolve: {
					confirmCallback: function () {
						return confirmCallback;
					},
					cancelCallback: function () {
						return cancelCallback;
					},
					content: function(){
						return content;
					}
				}
			};
		}

		function generateModalTemplate(title, content, type) {

			if(type == CRITICAL_DIALOG){
				var header = '<div class="modal-header alert alert-danger">'+
					'<h3 class="modal-title">' + title + '</h3>' +
				'</div>';
			}else{
				var header = '<div class="modal-header">' +
					'<h3 class="modal-title">' + title + '</h3>' +
				'</div>';
			}


			var body = '';

			if(type == CRITICAL_DIALOG){
				body += '<div class="modal-body xpd-modal-body-critical">';
			}else if(type == CONFIRM_DIALOG){
				body += '<div class="modal-body xpd-modal-body-confirm">';
			}else{
				body += '<div class="modal-body xpd-modal-body-message">';
			}

			if(content.templateUrl){
    			body += '<div ng-include src="'+'content.templateUrl'+'"></div>';
			}else if (content.templateHtml){
    			body += '<div>'+content.templateHtml+'</div>';
			}else{
				body += '<p>{{content.message}}</p>';
			}

			body += '</div>';

			var footer = '<div class="modal-footer">';

			if(type == MESSAGE_DIALOG){

				footer += '<div class="col-xs-12 text-center">' +
					'<button class="btn-modal btn-primary" type="button" ng-click="actionButtonYes()">OK</button>' +
				'</div>';

			}else if(type == CONFIRM_DIALOG || type == CRITICAL_DIALOG){
				footer +='<div class=" col-xs-6 text-center">' +
					'<button class="btn-modal btn-primary" type="button" ng-click="actionButtonYes()">YES</button>' +
				'</div>' +
				'<div class=" col-xs-6 text-center">' +
					'<button class="btn-modal btn-warning" type="button" ng-click="actionButtonNo()">NO</button>' +
				'</div>';
			}

			footer += '</div>';

			var modalContent = '';

			
			if(type == CRITICAL_DIALOG){
				modalContent += '<div class="modal-content xpd-modal-content-critical">';
			}else if(type == CONFIRM_DIALOG){
				modalContent += '<div class="modal-content xpd-modal-content-confirm">';
			}else{
				modalContent += '<div class="modal-content xpd-modal-content-message">';
			}

			modalContent += header;
			modalContent += body;
			modalContent += footer;
			modalContent += '</div>';

			return modalContent;
		}

		return {
			showMessageDialog: showMessageDialog,
			showConfirmDialog: showConfirmDialog,
			showCriticalDialog: showCriticalDialog
		};

	}
})();
