
// <!-- build:vendorcss -->
import './../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

import './../../../node_modules/angular-toastr/dist/angular-toastr.css';

import './../../../node_modules/font-awesome/css/font-awesome.min.css';
// <!-- endbuild -->

// <!-- build:basecss -->
import './../../assets/css/dhtmlxgantt.css';
import './../../assets/css/dhtmlxgantt_broadway.css';

import './../../assets/css/xpd.css';

import './../../assets/css/xpd-visualization.css';

import './../../assets/css/admin.css';

import './../../assets/css/pallete.css';

import './../../assets/css/angular.treeview.css';
// <!-- endbuild -->

import alarmInfoTemplate from './../../components/admin/views/forms/alarm-info.template.html';
import bhaContractTemplate from './../../components/admin/views/forms/bha-contract-info.template.html';
import bhaGeneralTemplate from './../../components/admin/views/forms/bha-general-info.template.html';
import casingContractTemplate from './../../components/admin/views/forms/casing-contract-info.template.html';
import casingGeneralTemplate from './../../components/admin/views/forms/casing-general-info.template.html';
import riserContractTemplate from './../../components/admin/views/forms/riser-contract-info.template.html';
import riserGeneralTemplate from './../../components/admin/views/forms/riser-general-info.template.html';
import timeContractTemplate from './../../components/admin/views/forms/time-contract-info.template.html';
import timeGeneralTemplate from './../../components/admin/views/forms/time-general-info.template.html';

import { XPDAdminModule } from './admin.module';

XPDAdminModule.component('alarmInfoTemplate', { template: alarmInfoTemplate });
XPDAdminModule.component('bhaContractTemplate', { template: bhaContractTemplate });
XPDAdminModule.component('bhaGeneralTemplate', { template: bhaGeneralTemplate });
XPDAdminModule.component('casingContractTemplate', { template: casingContractTemplate });
XPDAdminModule.component('casingGeneralTemplate', { template: casingGeneralTemplate });
XPDAdminModule.component('riserContractTemplate', { template: riserContractTemplate });
XPDAdminModule.component('riserGeneralTemplate', { template: riserGeneralTemplate });
XPDAdminModule.component('timeContractTemplate', { template: timeContractTemplate });
XPDAdminModule.component('timeGeneralTemplate', { template: timeGeneralTemplate });
