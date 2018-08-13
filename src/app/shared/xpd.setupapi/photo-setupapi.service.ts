import angular = require('angular');
import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict',

// 	photoAPIService.$inject = ['$http', 'xpdAccessService', 'setupAPIService'];

export class PhotoAPIService {

	public static $inject: string[] = ['$http', '$q', 'xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(
		private $http: ng.IHttpService,
		private $q: angular.IQService,
		private xpdAccessService: XPDAccessService,
		private setupAPIService: SetupAPIService) {

		this.BASE_URL = xpdAccessService.getSetupURL();
	}

	public loadPhoto(path, name) {

		const request = {
			method: 'GET',
			url: this.BASE_URL + path + '/load/' + name,
			responseType: 'arraybuffer',
		};

		return this.$q((successCallback, errorCallback) => {

			this.$http(request).then(
				(response) => {
					successCallback(this._arrayBufferToBase64(response.data));
				},
				(error) => {
					this.setupAPIService.generateToast(error);
					errorCallback(error);
				},
			);

		});

	}

	public uploadPhoto(fd, path) {

		return this.$q((successCallback, errorCallback) => {

			this.$http.post(this.BASE_URL + path + '/upload', fd, {
				withCredentials: false,
				headers: {
					'Content-Type': undefined,
				},
				transformRequest: angular.identity,
				params: {
					fd,
				},
			}).then(
				successCallback,
				function (error) {
					this.setupAPIService.generateToast(error);
					errorCallback(error);
				},
			);

		});

	}

	protected _arrayBufferToBase64(buffer) {
		let binary = '';
		const bytes = new Uint8Array(buffer);
		const len = bytes.byteLength;
		for (let i = 0; i < len; i++) {
			binary += String.fromCharCode(bytes[i]);
		}
		return window.btoa(binary);
	}

	// xpd-setup-api/tripin/rig-pictures/load/default

	// function getObjectById(modelURL, id, successCallback, errorCallback) {
	// 	$http.get(xpdAccessService.getSetupURL() + modelURL + '/' + id)
	// 		.then(
	// 			function(response) {
	// 				successCallback && successCallback(response.data);
	// 			},
	// 			function(error) {
	// 				setupAPIService.generateToast(error);
	// 				errorCallback && errorCallback(error);
	// 			},
	// 		);
	// }

}

// })();
