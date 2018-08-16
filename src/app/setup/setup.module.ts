import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { AlarmInfoController } from './components/operation/alarm-info.controller';
import { OperationController } from './components/operation/operation.controller';
import { SectionUpsertController } from './components/section/section-upsert.controller';
import { SectionController } from './components/section/section.controller';
import { WellUpsertController } from './components/well/well-upsert.controller';
import { WellController } from './components/well/well.controller';
import { SetupConfig } from './setup.config';

const XPDSetupModule: angular.IModule = angular.module('xpd.setup', [
	XPDSharedModule.name,
]);

import './../../assets/css/setup.scss';
import './../../assets/css/xpd.scss';

export { XPDSetupModule };

XPDSetupModule.config(SetupConfig);

XPDSetupModule.controller(AlarmInfoController.name, AlarmInfoController);
XPDSetupModule.controller(OperationController.name, OperationController);
XPDSetupModule.controller(SectionUpsertController.name, SectionUpsertController);
XPDSetupModule.controller(SectionController.name, SectionController);
XPDSetupModule.controller(WellUpsertController.name, WellUpsertController);
XPDSetupModule.controller(WellController.name, WellController);
