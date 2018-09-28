import * as angular from 'angular';

import { XPDSharedModule } from '../shared/shared.module';
import { AuthConfig } from './auth.config';
import { AccessFactoryLoginController } from './components/accessfactory.login.controller';

const XPDAuthModule: angular.IModule = angular.module('xpd.auth', [
	XPDSharedModule.name,
]);

// import './../../assets/css/setup.scss';
// import './../../assets/css/xpd.scss';

export { XPDAuthModule };

XPDAuthModule.config(AuthConfig);
XPDAuthModule.controller('AccessFactoryLoginController', AccessFactoryLoginController);
