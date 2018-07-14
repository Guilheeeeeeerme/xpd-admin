import * as angular from 'angular';
import { SocketIOService } from './socket.factory';

const XPDSocketIOModule: angular.IModule  = angular.module('socketIO', []);
export default XPDSocketIOModule;

XPDSocketIOModule.service('socketService', SocketIOService);
