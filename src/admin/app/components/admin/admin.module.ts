import 'angular-route';
import AngularTreeviewModule from '../../../../xpd-resources/ng/angular.treeview/angular-treeview.module';
import XPDDMECModule from '../../../../xpd-resources/ng/xpd.dmec/dmec.module';
import XPDEventDetailsModule from '../../../../xpd-resources/ng/xpd.modal.event-details/xpd-modal-event-details.module';
import XPDFailureModule from '../../../../xpd-resources/ng/xpd.modal.failure/xpd-modal-failure.module';
import XPDLayDownConfirmationModule from '../../../../xpd-resources/ng/xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import XPDLessonLearnedModule from '../../../../xpd-resources/ng/xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import { XPDRPDFormDirective } from '../../../../xpd-resources/ng/xpd.rpd/rpd.directive';
import { XPDSectionListDirective } from '../../../../xpd-resources/ng/xpd.section-list/section-list.directive';
import XPDSetupFormInputModule from '../../../../xpd-resources/ng/xpd.setup-form-input/setup-form-input.module';
import XPDSwitchModule from '../../../../xpd-resources/ng/xpd.switch/xpd.switch.module';
import XPDTimeSliceModule from '../../../../xpd-resources/ng/xpd.time-slices-table/time-slices-table.module';
import XPDTimersModule from '../../../../xpd-resources/ng/xpd.timers/xpd-timers.module';
import XPDTrackingModule from '../../../../xpd-resources/ng/xpd.tracking/tracking.module';
import XPDZeroTimeZoneModule from '../../../../xpd-resources/ng/xpd.zerotimezone/xpd.zerotimezone.module';

const XPDAdminModule: angular.IModule = angular.module('xpd.admin', [
	'ngRoute',
	'xpd.setupapi',
	'xpd.operation-dashboard',
	XPDTrackingModule.name,
	XPDDMECModule.name,
	XPDZeroTimeZoneModule.name,
	'xpd.form.validation',
	'gantt',
	'xpd.calculation',
	'xpd.contract-param',
	'xpd.filters',
	XPDTimersModule.name,
	'xpd.contractTimeInput',
	AngularTreeviewModule.name,
	XPDEventDetailsModule.name,
	XPDFailureModule.name,
	XPDLessonLearnedModule.name,
	'highcharts',
	XPDLayDownConfirmationModule.name,
	'xpd.menu-confirmation',
	'xpd.admin-nav-bar',
	'xpd.failure-controller',
	'xpd.planner',
	XPDSwitchModule.name,
	XPDSetupFormInputModule.name,
	'xpd.register-alarm-modal',
	XPDTimeSliceModule.name,
]);

export default XPDAdminModule;

XPDAdminModule.directive('xpdSectionList', XPDSectionListDirective.Factory());
XPDAdminModule.directive('rpdForm', XPDRPDFormDirective.Factory());
