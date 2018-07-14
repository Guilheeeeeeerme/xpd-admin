// (function() {
// 	'use strict';

// 	angular.module('xpd.failure-controller', [
// 		'xpd.communication',
// 		'xpd.setupapi',
// 		'xpd.dialog',
// 	]);

// })();

import * as angular from 'angular';
import { FailuresController } from '../../../components/admin/controllers/failures.controller';
import { LessonLearnedController } from '../../../components/admin/controllers/lesson-learned.controller';
import { TabsFailureLLCtrl } from '../../../components/admin/controllers/tabs-failure-lesson.controller';
import XPDCommunicationModule from '../xpd.communication/communication.module';
import XPDDialogModule from '../xpd.dialog/xpd.dialog.module';
import XPDSetupAPIModule from '../xpd.setupapi/setupapi.module';
import { FailureNavBarDirective } from './failure-nav-bar.directive';

const XPDFailureNavBarController: angular.IModule  = angular.module('xpd.failure-controller', [
	XPDCommunicationModule.name,
	XPDSetupAPIModule.name,
	XPDDialogModule.name,
]);
export default XPDFailureNavBarController;

XPDFailureNavBarController.directive('failureNavBar', FailureNavBarDirective.Factory());
XPDFailureNavBarController.controller('FailuresController', FailuresController);
XPDFailureNavBarController.controller('LessonLearnedController', LessonLearnedController);
XPDFailureNavBarController.controller('TabsFailureLLCtrl', TabsFailureLLCtrl);
