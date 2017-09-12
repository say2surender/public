'use strict';

angular.module('myApp.view1', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/view1', {
      templateUrl: 'js/view1/view1.html',
      controller: 'View1Ctrl'
    });
  }])

  .controller('View1Ctrl', ['$scope', '$http', 'uibDateParser', function($scope, $http, uibDateParser) {

    var eqA = R.eqBy(R.prop('id'));

    $scope.place = ""
    $scope.items = []
    $scope.page = 1
    $scope.selectedSkills = []
    $scope.modalShown = false;
    $scope.toggleModal = function(item) {
      $scope.modalShown = !$scope.modalShown;
      $scope.selectedId = item.id
      $http({
        method: 'GET',
        url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/' + item.id + '?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
      }).then(function successCallback(response) {
        $scope.selectedItem = response.data;
        $scope.skills = R.symmetricDifferenceWith(eqA, $scope.skills, response.data.skills)
        $scope.bgs = R.symmetricDifferenceWith(eqA, $scope.bgs, response.data.backgrounds)
        $scope.skills = R.map(R.merge({
          'ticked': true
        }), response.data.skills).concat($scope.skills)
        $scope.bgs = R.map(R.merge({
          'ticked': true
        }), response.data.bgs).concat($scope.backgrounds)
      }, function errorCallback(response) {});
    };

    const renameKeys = R.curry((keysMap, obj) =>
      R.reduce((acc, key) => R.assoc(keysMap[key] || key, obj[key], acc), {}, R.keys(obj))
    );


    $http({
      method: 'GET',
      url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/backgrounds?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c'
    }).then(function successCallback(response) {
      $scope.bgs = R.map(R.merge({
        'option': 'required',
        'level': null
      }), response.data)
    }, function errorCallback(response) {});



    $http({
      method: 'GET',
      url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/lists/skills?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c'
    }).then(function successCallback(response) {
      $scope.skills = R.map(R.merge({
        'option': 'required',
        'level': null
      }), response.data)
    }, function errorCallback(response) {});

    $scope.getOpps = function(page) {
      $scope.page = page
      $http({
        method: 'GET',
        url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
        params: {
          page: $scope.page
        }
      }).then(function successCallback(response) {
        $scope.items = response.data.data
        $scope.lastPage = 400
      }, function errorCallback(response) {});
    }

    $scope.getOpp525 = function() {
      $http({
        method: 'GET',
        url: 'https://gisapi-web-staging-1636833739.eu-west-1.elb.amazonaws.com/v2/opportunities/525?access_token=dd0df21c8af5d929dff19f74506c4a8153d7acd34306b9761fd4a57cfa1d483c',
      }).then(function successCallback(response) {
        $scope.opp525 = response.data
      }, function errorCallback(response) {});
    }

  }]);
