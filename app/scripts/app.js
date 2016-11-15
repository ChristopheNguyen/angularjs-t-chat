
angular.module('tchatAngularjsApp', ['ngRoute'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'LoginCtrl'
            })
            .when('/main', {
                controller: 'MainCtrl',
                resolve: {
                    "check": function ($location, $rootScope) {
                        if ($rootScope.loggedIn) {
                            $location.path('/main');
                        }
                    }
                },
                templateUrl: 'views/main.html'
            })
            .otherwise({
                redirectTo: '/'
            });
         })

    .run(function($location,$rootScope,Auth) {
        Auth.setUser(false);
        $location.path('/');
        $rootScope.$on('$routeChangeStart', function () {
            if (!Auth.isLoggedIn()) {
                $location.path('/');
            }
            else {
                $location.path('/main');
            }
        });
    })







