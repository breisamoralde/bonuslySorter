(function () {
    var app = angular.module('bonuslySorter', []);
    
    app.controller('IndexCtrl', function($http, $filter) {
        var vm = this;
        var baseUrl = 'https://bonus.ly/api/v1/';
        
        vm.accessToken = 'b498b87ee3c4511f16947f4d2970e673';
        vm.userId = '540da6baa454046f8a000001';
        vm.limit = 50;
        
        vm.getData = getData;
        
        vm.values = [
            'proactivity',
            'proficiency',
            'leadership',
            'bias-for-action',
            'speed',
            'frugality'
        ];
        
        vm.responses = {};
        
        function getData() {
            
            var usersEndpoint = formUrl();
            var fullUrl = baseUrl + usersEndpoint;
            var request = formGETRequest();
            
            $http.get(fullUrl, request).then(function(response) {
                var bonuses = response.data.result;
                
                angular.forEach(vm.values, function(value) {
                    vm.responses[value] = $filter('filter')(bonuses, {value : value}, true);
                });
                
            });  
        }
        
        function formGETRequest() {
            var request = {};
            request.method = 'GET';
            request.headers = {
                'Content-Type': 'application/json; charset=utf-8'
            }
            
            return request;
        }
        
        function formUrl() {
            return 'users/' + vm.userId + '/bonuses?limit=' + vm.limit + '&skip=0&access_token=' + vm.accessToken; 
        }
        
    });
    
})();