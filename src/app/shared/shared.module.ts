
import * as angular from 'angular';
import 'angular-animate';
import 'angular-route';
import 'angular-spinner';
import 'angular-toastr';
import 'angular-ui-bootstrap';
import 'angularjs-slider';
import 'bootstrap';
import 'jquery';

console.log('Importando css globais');
import './../../../node_modules/angular-toastr/dist/angular-toastr.css';
import './../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './../../../node_modules/font-awesome/css/font-awesome.min.css';

import './../../../node_modules/angularjs-slider/dist/rzslider.css';

import './../../assets/css/xpd-watermark.scss';

import './../../assets/css/bootstrap-fix.scss';

import './../../assets/css/equilibrium-time-table.scss';
import './../../assets/css/height.scss';
import './../../assets/css/scrollbar.scss';
import './../../assets/css/xpd-box.scss';
import './../../assets/css/xpd-chart-container.scss';
import './../../assets/css/xpd-operation-modal.scss';
import './../../assets/css/xpd-operation-table.scss';
import './../../assets/css/xpd-panel.scss';
import './../../assets/css/xpd-placeholder.scss';

import alarmInfoTemplate from './../../components/admin/views/forms/alarm-info.template.html';
import bhaContractTemplate from './../../components/admin/views/forms/bha-contract-info.template.html';
import bhaGeneralTemplate from './../../components/admin/views/forms/bha-general-info.template.html';
import casingContractTemplate from './../../components/admin/views/forms/casing-contract-info.template.html';
import casingGeneralTemplate from './../../components/admin/views/forms/casing-general-info.template.html';
import riserContractTemplate from './../../components/admin/views/forms/riser-contract-info.template.html';
import riserGeneralTemplate from './../../components/admin/views/forms/riser-general-info.template.html';
import timeContractTemplate from './../../components/admin/views/forms/time-contract-info.template.html';
import timeGeneralTemplate from './../../components/admin/views/forms/time-general-info.template.html';
import failureModalTemplate from './../../components/admin/views/modal/failures.modal.html';
import lessonLearndModalTemplate from './../../components/admin/views/modal/lesson-learned.modal.html';
import { AngularTreeviewModule } from './angular.treeview/angular-treeview.module';
import { XPDConnectionStatusModule } from './connection-status/connection-status.module';
import { XPDGanttModule } from './gantt/gantt.module';
import { XPDHighchartsModule } from './highcharts/highcharts.module';
import { XPDOperationConfigModule } from './operation-configuration/operation-configuration.module';
import { XPDAccessModule } from './xpd.access/accessfactory.module';
import { XPDAdminNavBarModule } from './xpd.admin-nav-bar/admin-nav-bar.module';
import { XPDAlarmUpsertModule } from './xpd.alarm/alarm.module';
import { XPDCalculationModule } from './xpd.calculation/calculation.module';
import { XPDContractParamModule } from './xpd.contract-param/contract-param.module';
import { XPDContractTimeInputModule } from './xpd.contract-time-input/contract-time-input.module';
import { XPDDialogModule } from './xpd.dialog/xpd.dialog.module';
import { XPDDMECModule } from './xpd.dmec/dmec.module';
import { XPDFailureNavBarController } from './xpd.failure-controller/failure-nv-bar.module';
import { XPDFiltersModule } from './xpd.filters/xpd-filter.module';
import { XPDFormValidationModule } from './xpd.form.validation/xpd.form.validation.module';
import { ngIntersection } from './xpd.intersection/xpd-intersection.module';
import { XPDMenuConfirmationModule } from './xpd.menu-confirmation/menu-confirmation.module';
import { XPDEventDetailsModule } from './xpd.modal.event-details/xpd-modal-event-details.module';
import { XPDFailureModule } from './xpd.modal.failure/xpd-modal-failure.module';
import { XPDLayDownConfirmationModule } from './xpd.modal.laydown-confirmation/xpd.modal.laydown-confirmation.module';
import { XPDLessonLearnedModule } from './xpd.modal.lessonlearned/xpd-modal-lessonlearned.module';
import { XPDOperationDataModule } from './xpd.operation-data/operation-data.module';
import { XPDWitsDataModule } from './xpd.wits-data/wits-data.module';
import { XPDOperationListModule } from './xpd.operation-list/operation-list.module';
import { XPDOperationManagerModule } from './xpd.operationmanager/operationmanager.module';
import { XPDPlannerModule } from './xpd.planner/planner.module';
import { XPDRegisterAlarmModule } from './xpd.register-alarm-modal/register-alarm-modal.module';
import { XPDScoredEventModule } from './xpd.scoredevent/scoredevent.module';
import { XPDSectionListModule } from './xpd.section-list/section-list.module';
import { XPDSetupFormInputModule } from './xpd.setup-form-input/setup-form-input.module';
import { XPDSetupAPIModule } from './xpd.setupapi/setupapi.module';
import { XPDSpinnerModule } from './xpd.spinner/xpd-spinner.module';
import { XPDSwitchModule } from './xpd.switch/xpd.switch.module';
import { XPDTimeSliceModule } from './xpd.time-slices-table/time-slices-table.module';
import { XPDTimersModule } from './xpd.timers/xpd-timers.module';
import { XPDUpcomingAlarm } from './xpd.upcoming-alarms/upcoming-alarms.module';
import { XPDVisualizationModule } from './xpd.visualization/xpd-visualization.module';
import { XPDZeroTimeZoneModule } from './xpd.zerotimezone/xpd.zerotimezone.module';

const XPDSharedModule: angular.IModule = angular.module('xpd.shared', [
	'ngRoute',
	'ui.bootstrap',
	'toastr',
	'ngAnimate',
	'angularSpinner',
	'rzModule',
	XPDDialogModule.name,
	XPDAccessModule.name,
	XPDCalculationModule.name,
	XPDContractParamModule.name,
	XPDContractTimeInputModule.name,
	XPDFiltersModule.name,
	ngIntersection.name,
	XPDMenuConfirmationModule.name,
	AngularTreeviewModule.name,
	XPDGanttModule.name,
	XPDHighchartsModule.name,
	XPDOperationDataModule.name,
	XPDWitsDataModule.name,
	XPDAdminNavBarModule.name,
	XPDFormValidationModule.name,
	XPDEventDetailsModule.name,
	XPDSpinnerModule.name,
	XPDTimersModule.name,
	XPDDMECModule.name,
	XPDSetupAPIModule.name,
	XPDFailureNavBarController.name,
	XPDFailureModule.name,
	XPDLayDownConfirmationModule.name,
	XPDLessonLearnedModule.name,
	XPDOperationManagerModule.name,
	XPDPlannerModule.name,
	XPDRegisterAlarmModule.name,
	XPDScoredEventModule.name,
	XPDSetupFormInputModule.name,
	XPDSwitchModule.name,
	XPDTimeSliceModule.name,
	XPDUpcomingAlarm.name,
	XPDVisualizationModule.name,
	XPDZeroTimeZoneModule.name,
	XPDSectionListModule.name,
	XPDConnectionStatusModule.name,
	XPDOperationListModule.name,
	XPDAlarmUpsertModule.name,
	XPDOperationConfigModule.name,
]);

export { XPDSharedModule };

XPDSharedModule.run(['$templateCache', ($templateCache: ng.ITemplateCacheService) => {
	$templateCache.put('alarm-info.template.html', alarmInfoTemplate);
	$templateCache.put('bha-contract-info.template.html', bhaContractTemplate);
	$templateCache.put('bha-general-info.template.html', bhaGeneralTemplate);
	$templateCache.put('casing-contract-info.template.html', casingContractTemplate);
	$templateCache.put('casing-general-info.template.html', casingGeneralTemplate);
	$templateCache.put('riser-contract-info.template.html', riserContractTemplate);
	$templateCache.put('riser-general-info.template.html', riserGeneralTemplate);
	$templateCache.put('time-contract-info.template.html', timeContractTemplate);
	$templateCache.put('time-general-info.template.html', timeGeneralTemplate);

	$templateCache.put('failures.modal.html', failureModalTemplate);
	$templateCache.put('lesson-learned.modal.html', lessonLearndModalTemplate);
}]);
