
import * as angular from 'angular';
import { TreeModelDirective } from './angular-treeview.directive';
import './angular.treeview.scss';

const AngularTreeviewModule: angular.IModule = angular.module('angularTreeview', []);

AngularTreeviewModule.directive('treeModel', TreeModelDirective.Factory());

export { AngularTreeviewModule };
