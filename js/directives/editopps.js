'use strict';

angular.module('myApp.modalDialog', ['ngRoute'])

  .directive('modalDialog', ['$http', function($http) {
    return {
      restrict: 'E',
      scope: {
        show: '=',
        title: '=',
        item: '=',
        skills: '=',
        selectedSkills: '=',
        bgs: '=',
        selectedId: '='
      },
      replace: true,
      transclude: true,
      link: function(scope, element, attrs) {
        scope.dialogStyle = {};
        if (attrs.width)
          scope.dialogStyle.width = attrs.width;
        if (attrs.height)
          scope.dialogStyle.height = attrs.height;
        scope.hideModal = function() {
          scope.show = false;
        };

        scope.onrefresh = function() {
          $http({
            method: 'GET',
            url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + scope.item.role_info.city + '&types=geocode&key=AIzaSyAASN-WrRCKRbQeyMNX6hwhKIqGK5-KeMM',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            }
          }).then(function successCallback(response) {
            scope.item.role_info.city = response.data.predictions.description;
            console.log(response)

          }, function errorCallback(response) {
            console.log(response)
          });
        }

        scope.sendPatch = function() {
          console.log(scope.item)

          $http({
            method: 'PATCH',
            url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/' + scope.item.id + '?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
            data: {
              'opportunity': scope.item
            }
          }).then(function successCallback(response) {
            console.log(response.data)
          }, function errorCallback(response) {
            console.log(response)
          });
        };


      },
      templateUrl: 'js/directives/editopps.html'
    };
  }]);
