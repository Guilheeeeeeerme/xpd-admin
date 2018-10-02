import { AuthService } from '../xpd.setupapi/auth.service';
import { XPDAccessService } from './access.service';

const checkIfItIsLogged = () => {
	console.log('Checking Credentials');

	if (!AuthService.isLogged()) {
		AuthService.redirectToPath('/auth.html#', false);
	}

};

const SecurityInteceptorFactory = (
	$q: any,
	xpdAccessService: XPDAccessService) => {

	let c1;
	let c2;
	let c3;

	const base64 = {
		_keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
		// tslint:disable-next-line:one-variable-per-declaration
		encode(e) { let t = ''; let n, r, i, s, o, u, a; let f = 0; e = base64._utf8_encode(e); while (f < e.length) { n = e.charCodeAt(f++); r = e.charCodeAt(f++); i = e.charCodeAt(f++); s = n >> 2; o = (n & 3) << 4 | r >> 4; u = (r & 15) << 2 | i >> 6; a = i & 63; if (isNaN(r)) { u = a = 64; } else if (isNaN(i)) { a = 64; } t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a); } return t; },
		// tslint:disable-next-line:one-variable-per-declaration
		decode(e) { let t = ''; let n, r, i; let s, o, u, a; let f = 0; e = e.replace(/[^A-Za-z0-9+/=]/g, ''); while (f < e.length) { s = this._keyStr.indexOf(e.charAt(f++)); o = this._keyStr.indexOf(e.charAt(f++)); u = this._keyStr.indexOf(e.charAt(f++)); a = this._keyStr.indexOf(e.charAt(f++)); n = s << 2 | o >> 4; r = (o & 15) << 4 | u >> 2; i = (u & 3) << 6 | a; t = t + String.fromCharCode(n); if (u !== 64) { t = t + String.fromCharCode(r); } if (a !== 64) { t = t + String.fromCharCode(i); } } t = base64._utf8_decode(t); return t; },
		_utf8_encode(e) { e = e.replace(/rn/g, 'n'); let t = ''; for (let n = 0; n < e.length; n++) { const r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); } else if (r > 127 && r < 2048) { t += String.fromCharCode(r >> 6 | 192); t += String.fromCharCode(r & 63 | 128); } else { t += String.fromCharCode(r >> 12 | 224); t += String.fromCharCode(r >> 6 & 63 | 128); t += String.fromCharCode(r & 63 | 128); } } return t; },
		_utf8_decode(e) { let t = ''; let n = 0; let r = c1 = c2 = 0; while (n < e.length) { r = e.charCodeAt(n); if (r < 128) { t += String.fromCharCode(r); n++; } else if (r > 191 && r < 224) { c2 = e.charCodeAt(n + 1); t += String.fromCharCode((r & 31) << 6 | c2 & 63); n += 2; } else { c2 = e.charCodeAt(n + 1); c3 = e.charCodeAt(n + 2); t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63); n += 3; } } return t; },
	};

	const request = (config) => {

		config.headers = config.headers || {};

		// config.headers.Authorization = 'Basic ' + base64.encode('admin:rzxtec123');

		// console.log('getRawReportsAPIURL', config.url.indexOf(xpdAccessService.getRawReportsAPIURL()));
		// console.log('getOperationServerURL', config.url.indexOf(xpdAccessService.getOperationServerURL()));

		if (config.url.indexOf(xpdAccessService.getRawReportsAPIURL()) >= 0) {
			config.headers.Authorization = 'Bearer ' + AuthService.getReportsAPIToken();
		} else if (config.url.indexOf(xpdAccessService.getOperationServerURL()) >= 0) {
			config.headers.Authorization = 'Bearer ' + AuthService.getOperationServerToken();
		} else {
			config.headers.Authorization = 'Basic ' + base64.encode('admin:rzxtec123');
		}

		// console.log(config.headers.Authorization);

		return config;
	};

	const responseError = (response) => {
		if (response.status === 401 || response.status === 403) {
			AuthService.logout();
		}

		return $q.reject(response);
	};

	return {
		request,
		responseError,
	};
};

SecurityInteceptorFactory.$inject = ['$q', 'xpdAccessService'];

checkIfItIsLogged();

export { SecurityInteceptorFactory };
