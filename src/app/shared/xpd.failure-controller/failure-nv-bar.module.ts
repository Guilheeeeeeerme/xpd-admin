// (function() {
// 	'use strict';

// 		'xpd.communication',
// 		'xpd.setupapi',
// 		'xpd.dialog',
// 	]);

// })();

import * as angular from 'angular';

import { FailuresController } from '../../admin/components/failure-lesson/failures.controller';
import { LessonLearnedController } from '../../admin/components/failure-lesson/lesson-learned.controller';
import { TabsFailureLLCtrl } from '../../admin/components/failure-lesson/tabs-failure-lesson.controller';
import { FailureNavBarDirective } from './failure-nav-bar.directive';

const XPDFailureNavBarController: angular.IModule  = angular.module('xpd.failure-controller', []);
export { XPDFailureNavBarController };

XPDFailureNavBarController.directive('xpdFailureNavBar', FailureNavBarDirective.Factory());
XPDFailureNavBarController.controller('FailuresController', FailuresController);
XPDFailureNavBarController.controller('LessonLearnedController', LessonLearnedController);
XPDFailureNavBarController.controller('TabsFailureLLCtrl', TabsFailureLLCtrl);
