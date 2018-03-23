'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './maps.routes';

export class MapsComponent {
  /*@ngInject*/
  constructor() {
    this.message = 'Hello';
  }
}

export default angular.module('myAppApp.maps', [uiRouter])
  .config(routes)
  .component('maps', {
    template: require('./maps.html'),
    controller: MapsComponent,
    controllerAs: 'mapsCtrl'
  })
  .name;
