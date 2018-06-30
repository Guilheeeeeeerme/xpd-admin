(function () {
	'use strict';

	var app = angular.module('xpd.timers', []);

	app.service('$xpdInterval', $xpdInterval);
	app.service('$xpdTimeout', $xpdTimeout);

	function doAsync(type, callback, timeout, scope) {

		var worker = new Worker('../assets/js/timer-worker.js');

		worker.postMessage({
			cmd: type,
			timeout: timeout
		});

		scope.$on('$destroy', function () {
			cancel(worker);
		});

		worker.addEventListener('message', function () {
			callback && callback();
			try {
				scope.$apply();
			} catch (e) {
				// esperado que de ruim as vezes
			}
		}, false);

		return worker;
	}

	function $xpdInterval() {
		function doInterval(callback, timeout, scope) {
			var worker = doAsync('interval', callback, timeout, scope);

			return worker;
		}
		doInterval.cancel = cancel;
		return doInterval;
	}

	function $xpdTimeout() {
		function doTimeout(callback, timeout, scope) {
			var worker = doAsync('timeout', callback, timeout, scope);

			return worker;
		}
		doTimeout.cancel = cancel;
		return doTimeout;
	}

	function cancel(worker) {
		try {
			worker.terminate();
		} catch (e) {
			console.error(e);
		}
	}

})();