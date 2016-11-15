
angular.module('tchatAngularjsApp')
    .controller('LoginCtrl',function ($scope, $location,$rootScope,Auth) {

        $scope.submitJoin = function() {
            $rootScope.username = $scope.username ;
            $location.path('/main');

            Auth.setUser(true);
        };

    });