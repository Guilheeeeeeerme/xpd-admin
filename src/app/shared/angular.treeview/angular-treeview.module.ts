
import * as angular from 'angular';
import { TreeModelDirective } from './angular-treeview.directive';

const AngularTreeviewModule: angular.IModule = angular.module('angularTreeview', []);

AngularTreeviewModule.directive('treeModel', TreeModelDirective.Factory());

export { AngularTreeviewModule };
