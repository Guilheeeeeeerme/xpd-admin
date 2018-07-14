import * as angular from 'angular';
import 'angular-animate';
import 'angular-route';
import 'angular-toastr';
import 'angular-ui-bootstrap';
import XPDDialogModule from '../../xpd-resources/ng/xpd.dialog/xpd.dialog.module';
import XPDSetupAPIModule from '../../xpd-resources/ng/xpd.setupapi/setupapi.module';
import { WellConfig } from './well-view-only.config';
import { WellViewOnlyController } from './well-view-only.controller';

const XPDWellViewOnlyModule: angular.IModule = angular.module('xpd.wellviewonly', [
	XPDDialogModule.name,
	XPDSetupAPIModule.name,
	'ngRoute',
	'ui.bootstrap',
	'toastr',
	'ngAnimate']);

XPDWellViewOnlyModule.config(WellConfig);
XPDWellViewOnlyModule.controller('WellViewOnlyController', WellViewOnlyController);

export default XPDWellViewOnlyModule;
