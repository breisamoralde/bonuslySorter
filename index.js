(function () {
    var app = angular.module('bonuslySorter', []);
    
    app.controller('IndexCtrl', function() {
        var vm = this;
        vm.test = 'hello';
        
        var accessToken = 'b498b87ee3c4511f16947f4d2970e673';
        var baseUrl = 'https://bonus.ly/api/v1/'
        var usersEndpoint = 'users/';
    });
    
})();