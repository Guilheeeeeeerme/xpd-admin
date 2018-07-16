import * as angular from 'angular';
import { XPDSharedModule } from '../shared/shared.module';
import { WellViewOnlyController } from './components/well-view-only/well-view-only.controller';
import { WellConfig } from './well-view-only.config';

const XPDWellViewOnlyModule: angular.IModule = angular.module('xpd.wellviewonly', [
	XPDSharedModule.name,
]);

XPDWellViewOnlyModule.config(WellConfig);
XPDWellViewOnlyModule.controller('WellViewOnlyController', WellViewOnlyController);

export { XPDWellViewOnlyModule };
