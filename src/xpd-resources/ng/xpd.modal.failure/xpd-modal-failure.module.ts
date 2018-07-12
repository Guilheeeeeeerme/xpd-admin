import * as angular from 'angular';
import { EventDetailsModalFactory } from '../xpd.modal.event-details/xpd-modal-event-details.factory';
import { ModalFailureController } from './xpd-modal-failure.controller';

const XPDFailureModule: angular.IModule = angular.module('xpd.modal-failure', []);
export default XPDFailureModule;

XPDFailureModule.factory('eventDetailsModal', EventDetailsModalFactory);
XPDFailureModule.controller('modalFailureController', ModalFailureController);
