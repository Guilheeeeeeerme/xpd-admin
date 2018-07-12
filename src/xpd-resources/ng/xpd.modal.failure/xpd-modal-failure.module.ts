import * as angular from 'angular';
import { EventDetailsModalFactory } from '../xpd.modal.event-details/xpd-modal-event-details.factory';

const XPDFailureModule: angular.IModule = angular.module('xpd.modal-failure', []);
export default XPDFailureModule;

XPDFailureModule.factory('eventDetailsModal', EventDetailsModalFactory);
// XPDFailureModule.controller('modalFailureController', ModalFailureController);
