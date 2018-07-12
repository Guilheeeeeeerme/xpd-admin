import * as angular from 'angular';
import { DMECService } from './dmec.service';

const XPDDMECModule: angular.IModule  = angular.module('xpd.dmec', []);
export default XPDDMECModule;

XPDDMECModule.service('dmecService', DMECService);
