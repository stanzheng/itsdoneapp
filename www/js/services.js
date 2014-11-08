//DEPLOYED
var baseUrl = 'http://104.236.42.109:8080/';

//DEVELOPMENT
var baseUrl = 'http://localhost:8080/';

angular.module('services', [])
//removed funtion signature
.factory('socket', function ($rootScope) {
  var socket = io.connect(baseUrl);
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
})

.factory('Auth', function Auth($q, $http,$location) {
  var user = null;
  
  try {
    user = JSON.parse(window.localStorage.getItem('user'));
  } catch(ex) { /* Silently fail, no user */ }

  var login = function login(email, password) {
    var deferred = $q.defer();
    // Use same service for URL
    if ($location.path() === 'login'){
      var url = baseUrl + 'login';
    }
    else {
      var url = baseUrl + 'signup';
    }
    var postData = { email: email, password: password };

    $http.post(url, postData).success(function(response) {
      console.log(response);
      if(response.local !== []) {
        user = { name: response.local.email, id: response.id, email: response.local.email };
        window.localStorage.setItem('user', JSON.stringify(user));
        return deferred.resolve(response);
      } else {
        return deferred.resolve('No user found');
      }
    }).error(function(error) {
      //Fail our promise.
      deferred.reject(error);
    });

    return deferred.promise;
  };

  var currentUser = function currentUser() {
    return user;
  };

  var logout = function logout() {
    user = null;
    window.localStorage.removeItem('user');
  };

  return {
    login: login,
    logout: logout,
    currentUser: currentUser
  };
});
// .factory('Request', function Auth($q, $http, param) {
//   var deferred = $q.defer();
//
//   var url = baseUrl + 'login';
//   var postData = { name: name, password: password };
//
//   $http.post(url, postData).success(function(response) {
//   if(response.success && (response.success === true || response.success == "true")) {
//     user = { name: response.name, id: response.id };
//     window.localStorage.setItem('user', JSON.stringify(user));
//     return deferred.resolve(response);
//   } else {
//     return deferred.resolve('No user found');
//   }
//   }).error(function(error) {
//   //Fail our promise.
//   deferred.reject(error);
//   });
//   return "here";
// });
