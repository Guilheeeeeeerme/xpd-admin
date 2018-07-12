import * as angular from 'angular';
import 'angular-ui-bootstrap';
import { DialogController } from './xpd.dialog.controller';
import { DialogFactory } from './xpd.dialog.factory';

const XPDDialogModule: angular.IModule = angular.module('xpd.dialog', ['ui.bootstrap']);
export default XPDDialogModule;

XPDDialogModule.controller('dialogController', DialogController);
XPDDialogModule.factory('dialogFactory', DialogFactory);
