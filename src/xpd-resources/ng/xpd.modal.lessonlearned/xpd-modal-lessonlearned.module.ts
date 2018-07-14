import * as angular from 'angular';
import { ModalLessonLearnedController } from './xpd-modal-lessonlearned.controller';
import { LessonLearnedModalService } from './xpd-modal-lessonlearned.service';

const XPDLessonLearnedModule: angular.IModule = angular.module('xpd.modal-lessonlearned', []);
export  { XPDLessonLearnedModule };

XPDLessonLearnedModule.service('lessonLearnedModal', LessonLearnedModalService);
XPDLessonLearnedModule.controller('modalLessonLearnedController', ModalLessonLearnedController);
