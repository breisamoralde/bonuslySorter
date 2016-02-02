(function () {
    var app = angular.module('bonuslySorter', []);
    
    app.controller('IndexCtrl', function($http, $filter, $timeout) {
        var vm = this;
        var baseUrl = 'https://bonus.ly/api/v1/';
        var userEndpoint = 'users/';
        var userInfo = undefined;
        
        vm.accessToken = 'b498b87ee3c4511f16947f4d2970e673';
        vm.userId = '540da6baa454046f8a000001';
        vm.limit = 50;
        vm.displayName = undefined;
        
        vm.loadingResults = false;
        vm.error = undefined;
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
            vm.loadingResults = true;
            clearData();
            
            getUserInfo().then(function(userData) {
                userInfo = userData.data.result;
                vm.displayName = userInfo.first_name + ' ' + userInfo.last_name;

                getBonuses().then(organizeBonuses, showError).finally(hideSpinner);  
            }, showError);
        }
        
        function clearData() {
            vm.error = undefined;
            vm.responses = {};
        }
        
        function showError(error) {
            vm.error = error.data.message;
            vm.loadingResults = false;
        }
        
        function organizeBonuses(response) {
            var bonuses = response.data.result;
            angular.forEach(vm.values, function(value) {
                vm.responses[value] = $filter('filter')(bonuses, {value : value, receiver: { username: userInfo.username}}, true);
            });
        }
        
        function hideSpinner() {
            vm.loadingResults = false;
        }
        
        function getBonuses() {
            var usersEndpoint = userEndpoint + vm.userId + '/bonuses?limit=' + vm.limit + '&skip=0&access_token=' + vm.accessToken; 
            var fullUrl = baseUrl + usersEndpoint;
            var request = formGETRequest();
            
            return $http.get(fullUrl, request);
        }
         
        function getUserInfo() {
            var meEndpoint = baseUrl + userEndpoint + 'me' + '?access_token=' + vm.accessToken;
            var request = formGETRequest();
            
            return $http.get(meEndpoint, request);
        }
        
        function formGETRequest() {
            var request = {};
            request.method = 'GET';
            request.headers = {
                'Content-Type': 'application/json; charset=utf-8'
            }
            
            return request;
        }
        
    });
    
})();