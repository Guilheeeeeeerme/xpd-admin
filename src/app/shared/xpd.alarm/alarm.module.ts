import * as angular from 'angular';
import { AlarmModalUpsertController } from './alarm-modal-upsert.controller';
import { AlarmCRUDService } from './alarm.service';
import { SavedAlarmsListDirective } from './saved-alarms-list/saved-alarms-list.directive';

const XPDAlarmUpsertModule: angular.IModule = angular.module('xpd.alarm-utils', []);
export { XPDAlarmUpsertModule };

XPDAlarmUpsertModule.service('alarmCRUDService', AlarmCRUDService);
XPDAlarmUpsertModule.controller('AlarmModalUpsertController', AlarmModalUpsertController);
XPDAlarmUpsertModule.directive('xpdSavedAlarmsList', SavedAlarmsListDirective.Factory());
