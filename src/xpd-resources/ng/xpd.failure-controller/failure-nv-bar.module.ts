// (function() {
// 	'use strict';

// 	angular.module('xpd.failure-controller', [
// 		'xpd.communication',
// 		'xpd.setupapi',
// 		'xpd.dialog',
// 	]);

// })();

import * as angular from 'angular';
import 'angular-ui-bootstrap';
import { FailuresController } from '../../../components/admin/controllers/failures.controller';
import { LessonLearnedController } from '../../../components/admin/controllers/lesson-learned.controller';
import { TabsFailureLLCtrl } from '../../../components/admin/controllers/tabs-failure-lesson.controller';
import { XPDDialogModule } from '../xpd.dialog/xpd.dialog.module';
import { XPDOperationDataModule } from '../xpd.operation-data/operation-data.module';
import { XPDSetupAPIModule } from '../xpd.setupapi/setupapi.module';
import { FailureNavBarDirective } from './failure-nav-bar.directive';

const XPDFailureNavBarController: angular.IModule  = angular.module('xpd.failure-controller', [
	'ui.bootstrap',
	XPDOperationDataModule.name,
	XPDSetupAPIModule.name,
	XPDDialogModule.name,
]);
export { XPDFailureNavBarController };

XPDFailureNavBarController.directive('failureNavBar', FailureNavBarDirective.Factory());
XPDFailureNavBarController.controller('FailuresController', FailuresController);
XPDFailureNavBarController.controller('LessonLearnedController', LessonLearnedController);
XPDFailureNavBarController.controller('TabsFailureLLCtrl', TabsFailureLLCtrl);
