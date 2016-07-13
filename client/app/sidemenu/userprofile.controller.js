(function () {
  angular.module('notinphillyServerApp')
    .controller('UserProfileController', [ '$scope', '$http', '$rootScope', 'sessionService', 'mapService', 'APP_EVENTS',
    function($scope, $http, $rootScope, sessionService, mapService, APP_EVENTS) {
      $scope.userProfile = {
        logout: function() {
          $rootScope.$broadcast(APP_EVENTS.SPINNER_START);
          sessionService.logout().then(function(response){
                                  $rootScope.$broadcast(APP_EVENTS.LOGOUT);
                                  $rootScope.$broadcast(APP_EVENTS.SPINNER_END);
                                },
                                function(err) {
                                  $rootScope.$broadcast(APP_EVENTS.SPINNER_END);
                                });
        },
        adoptedStreets: []
      };

      $scope.$on(APP_EVENTS.LOGIN_SUCCESS, function(event) {
        SetupCurrentUser();
      });
      $scope.$on(APP_EVENTS.LOGOUT, function(event) {

      });
      $scope.$on(APP_EVENTS.STREET_ADOPTED, function(event) {
        SetupUserStreets();
      });
      $scope.$on(APP_EVENTS.STREET_LEFT, function(event) {
        SetupUserStreets();
      });

      $scope.locateStreet = function (streetId)
      {
        $rootScope.$broadcast(APP_EVENTS.ENTER_STREET_LEVEL);
        mapService.goToStreet(streetId);
      };

      SetupCurrentUser();

      function SetupCurrentUser()
      {
        if($rootScope.currentUser)
        {
          $http.get("api/users/current/").success(function(data, status) {
            $scope.userProfile.fullName = data.firstName + ' ' + data.lastName;
            $scope.userProfile.address = data.houseNumber + " " + data.streetName + " " + data.zip;
            $scope.userProfile.email = data.email;

            SetupUserStreets();
          },
          function(err) {

          });
        }
      }

      function SetupUserStreets(){
        $http.get("api/streets/current/").success(function(data, status) {
          $scope.userProfile.adoptedStreets = data;
        });
      }
    }]);
})();
