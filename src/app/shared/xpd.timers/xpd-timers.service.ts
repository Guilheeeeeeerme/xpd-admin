
// tslint:disable-next-line:max-classes-per-file

// import Worker from './xpd-timers.worker.js';

class XPDAsync {

	public cancel(worker) {
		try {
			worker.terminate();
		} catch (e) {
			console.error(e);
		}
	}

	public doAsync(type, callback, timeout, scope) {

		const worker = new Worker('./xpd-timers.worker/xpd-timers.worker.js');

		worker.postMessage({
			cmd: type,
			timeout,
		});

		scope.$on('$destroy', () => {
			this.cancel(worker);
		});

		worker.addEventListener('message', () => {
			if (callback) { callback(); }
			try {
				scope.$apply();
			} catch (e) {
				// esperado que de ruim as vezes
			}
		}, false);

		return worker;
	}

}

// tslint:disable-next-line:max-classes-per-file
export class XPDIntervalService extends XPDAsync {
	public run(callback, timeout, scope) {
		const worker = this.doAsync('interval', () => { callback(); }, timeout, scope);
		return worker;
	}
}

// tslint:disable-next-line:max-classes-per-file
export class XPDTimeoutService extends XPDAsync {
	public run(callback, timeout, scope) {
		const worker = this.doAsync('timeout', () => { callback(); }, timeout, scope);
		return worker;
	}
}
