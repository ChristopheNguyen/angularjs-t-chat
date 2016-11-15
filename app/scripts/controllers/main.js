
angular.module('tchatAngularjsApp')
    .controller('MainCtrl', function ($scope,$rootScope,socket) {

      $scope.messages = [];

      $scope.sendMessage = function () {
          var datas = {
              username :  $rootScope.username,
              message: $scope.message
          };
          socket.emit('send msg',datas);
          $scope.message = '';
      };

      socket.on('get msg',function (data){
          $scope.$apply(function() {
              $scope.messages.push(({
                  user:  data.username,
                  text: data.message
              }));
          });
      });

      socket.emit('set new user', $rootScope.username);
      socket.on('get users list', function(data){
          $scope.$apply(function() {
              $scope.listConnected = data;
          });
      });

      socket.emit('get old msg');
      socket.on('set old msg', function(data){
          for (var i = 0; i < data.length; i++) {
              $scope.$apply(function() {
                  $scope.messages.push(({
                      user: data[i].username,
                      text: data[i].message
                  }));
              });
          }
      });
    });
