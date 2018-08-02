// (function() {
// 	'use strict';

import * as angular from 'angular';
import { XPDEventLabelFilter } from './xpd-event-label.filter';
import { XPDPercentageFilter } from './xpd-percentage.filter';
import { XPDReadingAttrFilter } from './xpd-reading-attr.filter';
import { XPDSecondsToHourMinutesSecondsFilter } from './xpd-seconds-to-hour-minutes-seconds.filter';
import { XPDSecondsToHourMinutesFilter } from './xpd-seconds-to-hour-minutes.filter';
import { XPDStateLabelFilter } from './xpd-state-label.filter';

const XPDFiltersModule: angular.IModule = angular.module('xpd.filters', []);

XPDFiltersModule.filter('percentage', XPDPercentageFilter);
XPDFiltersModule.filter('secondsToHourMinutes', XPDSecondsToHourMinutesFilter);
XPDFiltersModule.filter('xpdStateLabelFilter', XPDStateLabelFilter);
XPDFiltersModule.filter('xpdEventLabelFilter', XPDEventLabelFilter);
XPDFiltersModule.filter('secondsToHourMinutesSeconds', XPDSecondsToHourMinutesSecondsFilter);
XPDFiltersModule.filter('readingAttrFilter', XPDReadingAttrFilter);

const toFixed = (time) => {
	if (time >= 0 && time < 10) {
		return '0' + time;
	} else if (time > -10 && time < 0) {
		return '-0' + Math.abs(time);
	} else {
		return String(time);
	}
};
export { XPDFiltersModule, toFixed };

// })();
