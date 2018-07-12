import * as angular from 'angular';
import { ModalEventDetailsController } from './xpd-modal-event-details.controller';

const XPDEventDetailsModule: angular.IModule = angular.module('xpd.modal-event-details', []);
export default XPDEventDetailsModule;

XPDFailureModule.factory('failureModal', FailureModalFactory);
XPDFailureModule.controller('modalEventDetailsController', ModalEventDetailsController);

