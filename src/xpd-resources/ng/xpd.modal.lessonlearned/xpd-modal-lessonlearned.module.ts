import * as angular from 'angular';
import { ModalLessonLearnedController } from './xpd-modal-lessonlearned.controller';
import { LessonLearnedModalFactory } from './xpd-modal-lessonlearned.factory';

const XPDLessonLearnedModule: angular.IModule = angular.module('xpd.modal-lessonlearned', []);
export default XPDLessonLearnedModule;

XPDLessonLearnedModule.factory('lessonLearnedModal', LessonLearnedModalFactory);
XPDLessonLearnedModule.controller('modalLessonLearnedController', ModalLessonLearnedController);
