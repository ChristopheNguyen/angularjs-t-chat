
angular.module('tchatAngularjsApp')
    .factory('socket', ['$rootScope', function() {
        var socket = io.connect('http://localhost:3000');
        return socket;
    }]);


