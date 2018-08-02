import * as angular from 'angular';
import { ModalEventDetailsController } from './xpd-modal-event-details.controller';
import { EventDetailsModalService } from './xpd-modal-event-details.factory';

const XPDEventDetailsModule: angular.IModule = angular.module('xpd.modal-event-details', []);
export  { XPDEventDetailsModule };

XPDEventDetailsModule.service('eventDetailsModalService', EventDetailsModalService);
XPDEventDetailsModule.controller('modalEventDetailsController', ModalEventDetailsController);
