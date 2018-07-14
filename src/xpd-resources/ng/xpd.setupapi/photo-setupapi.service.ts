import angular = require('angular');
import { XPDAccessService } from '../xpd.access/access.service';
import { SetupAPIService } from './setupapi.service';

// (function() {
// 	'use strict',

// 	angular.module('xpd.setupapi').service('photoAPIService', photoAPIService);

// 	photoAPIService.$inject = ['$http', 'xpdAccessService', 'setupAPIService'];

export class PhotoAPIService {

	public static $inject: string[] = ['$http', 'xpdAccessService', 'setupAPIService'];
	public BASE_URL: string;

	constructor(private $http: ng.IHttpService, private xpdAccessService: XPDAccessService, private setupAPIService: SetupAPIService) {
		this.BASE_URL = xpdAccessService.getSetupURL();
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

	public loadPhoto(path, name, successCallback, errorCallback?) {

		const request = {
			method: 'GET',
			url: this.BASE_URL + path + '/load/' + name,
			responseType: 'arraybuffer',
		};

		this.$http(request).then(
			(response) => {
				if (successCallback) {
					successCallback(this._arrayBufferToBase64(response.data));
				}
			},
			(error) => {
				this.setupAPIService.generateToast(error);
				if (errorCallback) {
					errorCallback(error);
				}
			},
		);
	}

	public uploadPhoto(fd, path, successCallback, errorCallback?) {

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
			function(error) {
				this.setupAPIService.generateToast(error);
				if (errorCallback) {
					errorCallback(error);
				}
			},
		);

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
