(function () {
    var app = angular.module('bonuslySorter', []);
    
    app.controller('IndexCtrl', function($http) {
        var vm = this;
        var baseUrl = 'https://bonus.ly/api/v1/';
        
        vm.accessToken = 'b498b87ee3c4511f16947f4d2970e673';
        vm.userId = '540da6baa454046f8a000001';
        vm.getData = getData;
        
        function getData() {
            
            var usersEndpoint = 'users/' + vm.userId + '/bonuses?access_token=' + vm.accessToken;
            var fullUrl = baseUrl + usersEndpoint;
            
            var request = {};
            request.method = 'GET';
            request.headers = {
                'Content-Type': 'application/json; charset=utf-8'
            }   
            
            $http.get(fullUrl, request).then(function(response) {
                console.log('response: ', response)        
            });  
        }
        
    });
    
})();