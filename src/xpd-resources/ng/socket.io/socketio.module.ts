import * as angular from 'angular';
import { SocketIOFactory } from './socket.factory';

const XPDSocketIOModule: angular.IModule  = angular.module('socketIO', []);
export default XPDSocketIOModule;

XPDSocketIOModule.factory('socketFactory', SocketIOFactory);
