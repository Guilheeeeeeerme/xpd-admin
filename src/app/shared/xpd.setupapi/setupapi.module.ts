import * as angular from 'angular';

import { AlarmSetupAPIService } from './alarm-setupapi.service';
import { AuthService } from './auth.service';
import { CategorySetupAPIService } from './category-setupapi.service';
import { EventLogSetupAPIService } from './eventlog-setupapi.service';
import { FailureSetupAPIService } from './failure-setupapi.service';
import { LessonLearnedSetupAPIService } from './lessonlearned-setupapi.service';
import { OperationSetupAPIService } from './operation-setupapi.service';
import { PhotoApiDirective } from './photo-setupapi.directive';
import { PhotoAPIService } from './photo-setupapi.service';
import { ReadingSetupAPIService } from './reading-setupapi.service';
import { ReportsSetupAPIService } from './reports-setupapi.service';
import { ScheduleSetupAPIService } from './schedule-setupapi.service';
import { SectionSetupAPIService } from './section-setupapi.service';
import { SetupAPIConfig } from './setupapi.config';
import { SetupAPIService } from './setupapi.service';
import { WellSetupAPIService } from './well-setupapi.service';

const XPDSetupAPIModule: angular.IModule = angular.module('xpd.setupapi', []);
export  { XPDSetupAPIModule };

XPDSetupAPIModule.config(SetupAPIConfig);
XPDSetupAPIModule.service('setupAPIService', SetupAPIService);
XPDSetupAPIModule.service('wellSetupAPIService', WellSetupAPIService);
XPDSetupAPIModule.service('sectionSetupAPIService', SectionSetupAPIService);
XPDSetupAPIModule.service('scheduleSetupAPIService', ScheduleSetupAPIService);
XPDSetupAPIModule.service('reportsSetupAPIService', ReportsSetupAPIService);
XPDSetupAPIModule.service('readingSetupAPIService', ReadingSetupAPIService);
XPDSetupAPIModule.service('photoAPIService', PhotoAPIService);
XPDSetupAPIModule.directive('xpdPhotoApiDirective', PhotoApiDirective.Factory());
XPDSetupAPIModule.service('operationSetupAPIService', OperationSetupAPIService);
XPDSetupAPIModule.service('lessonLearnedSetupAPIService', LessonLearnedSetupAPIService);
XPDSetupAPIModule.service('failureSetupAPIService', FailureSetupAPIService);
XPDSetupAPIModule.service('eventlogSetupAPIService', EventLogSetupAPIService);
XPDSetupAPIModule.service('categorySetupAPIService', CategorySetupAPIService);
XPDSetupAPIModule.service('alarmSetupAPIService', AlarmSetupAPIService);
XPDSetupAPIModule.service('authService', AuthService);
