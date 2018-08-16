import * as angular from 'angular';
import { ModalFailureController } from './xpd-modal-failure.controller';
import { FailureModalFactory } from './xpd-modal-failure.factory';

const XPDFailureModule: angular.IModule = angular.module('xpd.modal-failure', []);
export  { XPDFailureModule };

XPDFailureModule.controller('ModalFailureController', ModalFailureController);
XPDFailureModule.service('failureModal', FailureModalFactory);
