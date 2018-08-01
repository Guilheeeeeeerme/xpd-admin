import { toFixed } from './xpd-filter.module';

const XPDSecondsToHourMinutesFilter = ($filter) => {
	return (seconds) => {

		let startWith = '';

		if (seconds < 0) {
			startWith = '-';
			seconds = Math.abs(seconds);
		}

		// TODO durações negativas

		let milliseconds = Math.round(seconds * 1000);

		let hours = Math.floor(milliseconds / 3600000);
		milliseconds = milliseconds % 3600000;

		const minutes = Math.floor(milliseconds / 60000);
		milliseconds = milliseconds % 60000;

		const seconds2 = Math.floor(milliseconds / 1000);
		milliseconds = milliseconds % 1000;

		if (hours <= 0) {
			return startWith + toFixed(minutes) + 'm: ' + toFixed(seconds2) + 's';
		} else if (hours < 24) {
			return startWith + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm: ' + toFixed(seconds2) + 's';
		} else {
			const days = Math.floor(hours / 24);
			hours = hours % 24;

			return startWith + days + 'd ' + toFixed(hours) + 'h: ' + toFixed(minutes) + 'm';
		}
	};
};

XPDSecondsToHourMinutesFilter.$inject = ['$filter'];

export { XPDSecondsToHourMinutesFilter };
