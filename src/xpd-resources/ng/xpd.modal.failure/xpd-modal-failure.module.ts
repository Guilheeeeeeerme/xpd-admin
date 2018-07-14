import * as angular from 'angular';
import { EventDetailsModalService } from '../xpd.modal.event-details/xpd-modal-event-details.factory';
import { ModalFailureController } from './xpd-modal-failure.controller';
import { FailureModalFactory } from './xpd-modal-failure.factory';

const XPDFailureModule: angular.IModule = angular.module('xpd.modal-failure', []);
export  { XPDFailureModule }

XPDFailureModule.controller('modalFailureController', ModalFailureController);
XPDFailureModule.service('failureModal', FailureModalFactory);
