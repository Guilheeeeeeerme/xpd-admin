// (function () {
// 	'use strict';

// 	let app = angular.module('xpd.timers', []);

// 	app.service('$xpdInterval', $xpdInterval);
// 	app.service('$xpdTimeout', $xpdTimeout);

export { XPDIntervalService, XPDTimeoutService };

class XPDIntervalService {

	public run(callback, timeout, scope) {
		const worker = doAsync('interval', callback, timeout, scope);
		return worker;
	}
	public cancel;
}

// tslint:disable-next-line:max-classes-per-file
class XPDTimeoutService {

	public run(callback, timeout, scope) {
		const worker = doAsync('timeout', callback, timeout, scope);
		return worker;
	}
	public cancel;
}

function cancel(worker) {
	try {
		worker.terminate();
	} catch (e) {
		console.error(e);
	}
}

function doAsync(type, callback, timeout, scope) {

	const worker = new Worker('./xpd-timers.worker.js');

	worker.postMessage({
		cmd: type,
		timeout,
	});

	scope.$on('$destroy', function () {
		cancel(worker);
	});

	worker.addEventListener('message', function () {
		if (callback) { callback(); }
		try {
			scope.$apply();
		} catch (e) {
			// esperado que de ruim as vezes
		}
	}, false);

	return worker;
}


// })();
