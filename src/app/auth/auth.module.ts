import * as angular from 'angular';

import authTemplate from './auth.template.html';

import { XPDSharedModule } from '../shared/shared.module';
import { AuthConfig } from './auth.config';
import { AccessFactoryLoginController } from './components/accessfactory.login.controller';

const XPDAuthModule: angular.IModule = angular.module('xpd.auth', [
	XPDSharedModule.name,
]);

// import './../../assets/css/setup.scss';
// import './../../assets/css/xpd.scss';
import './auth.style.scss';

export { XPDAuthModule };

XPDAuthModule.config(AuthConfig);
XPDAuthModule.controller('AccessFactoryLoginController', AccessFactoryLoginController);

XPDAuthModule.component('xpdAuthComponent', {
	template: authTemplate,
	controller: 'AccessFactoryLoginController as afController',
});
