import * as angular from 'angular';
import { ModalEventDetailsController } from './xpd-modal-event-details.controller';
import { EventDetailsModalFactory } from './xpd-modal-event-details.factory';

const XPDEventDetailsModule: angular.IModule = angular.module('xpd.modal-event-details', []);
export default XPDEventDetailsModule;

XPDEventDetailsModule.factory('eventDetailsModal', EventDetailsModalFactory);
XPDEventDetailsModule.controller('modalEventDetailsController', ModalEventDetailsController);
