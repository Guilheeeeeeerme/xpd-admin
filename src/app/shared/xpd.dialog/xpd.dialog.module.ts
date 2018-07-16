import * as angular from 'angular';

import { DialogController } from './xpd.dialog.controller';
import { DialogService } from './xpd.dialog.factory';

const XPDDialogModule: angular.IModule = angular.module('xpd.dialog', []);
export { XPDDialogModule };

XPDDialogModule.controller('dialogController', DialogController);
XPDDialogModule.service('dialogService', DialogService);
