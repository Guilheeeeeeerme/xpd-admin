import { IQService } from 'angular';
import 'angular-spinner';
import { IToastrService } from 'angular-toastr';
import { OperationDataService } from '../xpd.operation-data/operation-data.service';

export class SetupAPIService {

	public static $inject: string[] = ['$http', '$q', 'toastr', 'usSpinnerService', 'operationDataService'];
	private runningRequests: number = 0;
	private hasRunningRequests: boolean = false;

	constructor(
		private $http: ng.IHttpService,
		private $q: IQService,
		private toastr: IToastrService,
		private usSpinnerService: any,
		private operationDataService: OperationDataService) {

	}

	public doRequest(req, log: boolean, hideSpinner?: boolean) {
		const self = this;

		hideSpinner = hideSpinner === true;

		const request = this.$http(req);

		if (log) {
			this.operationDataService.log(req.method + ' ' + req.url, req);
		}

		if (!hideSpinner) {

			++this.runningRequests;

			if (!this.hasRunningRequests) {
				this.hasRunningRequests = true;
				this.usSpinnerService.spin('xpd-spinner');
			}

		}

		return this.$q((successCallback, errorCallback) => {

			request.then(
				(response: any) => {
					if (response && response.data && (response.data.isWrappedResponse || response.data.timestamp)) {
						successCallback(response.data.data);
					} else {
						successCallback(response.data);
					}

				},
				(error) => {
					this.generateToast(error);
					errorCallback(error);
				},
			).finally(() => {
				self.finallySpinner(hideSpinner);
			});

		});

	}

	public generateToast(error) {

		console.error(error);

		let httpStatus = this.getHttpStatus(error.status);
		// const url = (error.config.method === 'GET') ? '\n' + error.config.url : null;

		if (error.data) {

			let message = '';

			if (!error.data.message) {

				error = {
					message: error,
				};

				error.message = error.message.split('<body>')[1];
				error.message = error.message.split('</body>')[0];

				message = error.message.replace(/<[^>]*>/g, '\n');
			} else {
				message = error.data.message;
			}

			httpStatus += '\n' + message;

		}

		this.toastr.error(httpStatus);

		// if (url && error.status == -1) {
		// 	window.open(url, httpStatus);
		// }

	}

	private finallySpinner(hideSpinner: boolean) {

		if (!hideSpinner) {

			--this.runningRequests;

			if (this.runningRequests === 0) {
				this.hasRunningRequests = false;
				this.usSpinnerService.stop('xpd-spinner');
			}
		}
	}

	private getHttpStatus(errorCode) {

		if (errorCode === -1) { return 'Insecure Response'; }
		if (errorCode === 100) { return 'Continue'; }
		if (errorCode === 101) { return 'Switching Protocols'; }
		if (errorCode === 102) { return 'Processing'; }
		if (errorCode === 200) { return 'OK'; }
		if (errorCode === 201) { return 'Created'; }
		if (errorCode === 202) { return 'Accepted'; }
		if (errorCode === 203) { return 'Non-authoritative Information'; }
		if (errorCode === 204) { return 'No Content'; }
		if (errorCode === 205) { return 'Reset Content'; }
		if (errorCode === 206) { return 'Partial Content'; }
		if (errorCode === 207) { return 'Multi-Status'; }
		if (errorCode === 208) { return 'Already Reported'; }
		if (errorCode === 226) { return 'IM Used'; }
		if (errorCode === 300) { return 'Multiple Choices'; }
		if (errorCode === 301) { return 'Moved Permanently'; }
		if (errorCode === 302) { return 'Found'; }
		if (errorCode === 303) { return 'See Other'; }
		if (errorCode === 304) { return 'Not Modified'; }
		if (errorCode === 305) { return 'Use Proxy'; }
		if (errorCode === 307) { return 'Temporary Redirect'; }
		if (errorCode === 308) { return 'Permanent Redirect'; }
		if (errorCode === 400) { return 'Bad Request'; }
		if (errorCode === 401) { return 'Unauthorized'; }
		if (errorCode === 402) { return 'Payment Required'; }
		if (errorCode === 403) { return 'Forbidden'; }
		if (errorCode === 404) { return 'Not Found'; }
		if (errorCode === 405) { return 'Method Not Allowed'; }
		if (errorCode === 406) { return 'Not Acceptable'; }
		if (errorCode === 407) { return 'Proxy Authentication Required'; }
		if (errorCode === 408) { return 'Request Timeout'; }
		if (errorCode === 409) { return 'Conflict'; }
		if (errorCode === 410) { return 'Gone'; }
		if (errorCode === 411) { return 'Length Required'; }
		if (errorCode === 412) { return 'Precondition Failed'; }
		if (errorCode === 413) { return 'Payload Too Large'; }
		if (errorCode === 414) { return 'Request-URI Too Long'; }
		if (errorCode === 415) { return 'Unsupported Media Type'; }
		if (errorCode === 416) { return 'Requested Range Not Satisfiable'; }
		if (errorCode === 417) { return 'Expectation Failed'; }
		if (errorCode === 418) { return 'I\'m a teapot'; }
		if (errorCode === 421) { return 'Misdirected Request'; }
		if (errorCode === 422) { return 'Unprocessable Entity'; }
		if (errorCode === 423) { return 'Locked'; }
		if (errorCode === 424) { return 'Failed Dependency'; }
		if (errorCode === 426) { return 'Upgrade Required'; }
		if (errorCode === 428) { return 'Precondition Required'; }
		if (errorCode === 429) { return 'Too Many Requests'; }
		if (errorCode === 431) { return 'Request Header Fields Too Large'; }
		if (errorCode === 444) { return 'Connection Closed Without Response'; }
		if (errorCode === 451) { return 'Unavailable For Legal Reasons'; }
		if (errorCode === 499) { return 'Client Closed Request'; }
		if (errorCode === 500) { return 'Internal Server Error'; }
		if (errorCode === 501) { return 'Not Implemented'; }
		if (errorCode === 502) { return 'Bad Gateway'; }
		if (errorCode === 503) { return 'Service Unavailable'; }
		if (errorCode === 504) { return 'Gateway Timeout'; }
		if (errorCode === 505) { return 'HTTP Version Not Supported'; }
		if (errorCode === 506) { return 'Variant Also Negotiates'; }
		if (errorCode === 507) { return 'Insufficient Storage'; }
		if (errorCode === 508) { return 'Loop Detected'; }
		if (errorCode === 510) { return 'Not Extended'; }
		if (errorCode === 511) { return 'Network Authentication Required'; }
		if (errorCode === 599) { return 'Network Connect Timeout Error'; }
	}
}

// })();
