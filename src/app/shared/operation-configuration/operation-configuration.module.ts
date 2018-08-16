import * as angular from 'angular';
import { OperationConfigurationService } from './operation-configuration.service';

const XPDOperationConfigModule: angular.IModule = angular.module('xpd.operation-config', []);

export { XPDOperationConfigModule };

XPDOperationConfigModule.service(OperationConfigurationService.name, OperationConfigurationService);
