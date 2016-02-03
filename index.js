(function () {
    var app = angular.module('bonuslySorter', []);
    
    app.controller('IndexCtrl', function($http, $filter, $timeout, $location, $anchorScroll) {
        var vm = this;

        vm.getData = getData;
        vm.getButtonText = _getButtonText;
        vm.hasAPIKey = _hasAPIKey;
        vm.shouldDisplayTopReceiverText = _shouldDisplayTopReceiverText;
        vm.backToTop = _backToTop;

        vm.accessToken = undefined;
        vm.accessToken = 'b61bb1e8a586ca461aef33a60d5cc4a8';
        vm.userId = undefined;
        vm.limit = 50;
        vm.displayName = undefined;

        vm.loadingResults = false;
        vm.responses = {};
        vm.error = undefined;

        vm.isTopOverlaying = false;

        var apiAccessTokenStatus = undefined;

        var receiverBlock = jQuery('h2#receiver-block');

        jQuery(window).scroll(function() {
            var receiverBlockTop = receiverBlock.offset().top - receiverBlock.outerHeight();
            var bodyScrollTopPosition = jQuery('body').scrollTop();
            $timeout(function() { vm.isTopOverlaying = bodyScrollTopPosition > receiverBlockTop; });
        });

        $anchorScroll.yOffset = jQuery('nav.navbar-fixed-top').outerHeight();

        var _BASE_BONUSLY_API_URL = 'https://bonus.ly/api/v1/',
            _USERS_ENDPOINT = 'users/',
            _BONUSLY_VALUES = [
                'proactivity',
                'proficiency',
                'leadership',
                'bias-for-action',
                'speed',
                'frugality'
            ];
        
        function getData() {
            vm.loadingResults = true;

            _clearData();
            
            _getReceiverInfo()
                .then(_onGetUserInfoSuccess, _showError);


            function _getReceiverInfo() {
                var receiverEndpoint = _BASE_BONUSLY_API_URL + _USERS_ENDPOINT + _resolveReceiver() +
                    'access_token=' + vm.accessToken;
                var request = _formGETRequest();

                return $http.get(receiverEndpoint, request);


                function _resolveReceiver() {
                    return _isReceiverEmailAddressDefined() ?
                        '?email=' + vm.userId + '&' :
                        'me?';
                }
            }

            function _onGetUserInfoSuccess(receiverData) {
                apiAccessTokenStatus = 200;
                var resultData = receiverData.data.result;

                _validateResults();

                var receiverInfo = _isReceiverEmailAddressDefined() ? resultData[0] : resultData;
                var receiverEmailAddress = receiverInfo.email;

                vm.displayName = receiverInfo.first_name + ' ' + receiverInfo.last_name;

                _getBonuses()
                    .then(_organizeBonuses, _showError)
                    .finally(_hideSpinner);


                function _validateResults() {
                    var emailAddressInvalidErrorMessage = undefined;

                    if (!_isReceiverEmailAddressDefined() || resultData.length === 1) {
                        return;
                    }
                    else if (resultData.length === 0) {
                        emailAddressInvalidErrorMessage = 'Who is \'' + vm.userId + '\'?';
                    }
                    else if (resultData.length > 1) {
                        emailAddressInvalidErrorMessage = 'Email Address \'' + vm.userId + '\'' +
                            ' has many identities!'
                    }

                    vm.error = emailAddressInvalidErrorMessage;
                    vm.loadingResults = false;
                    throw new Error(emailAddressInvalidErrorMessage);
                }

                function _getBonuses() {
                    var usersEndpoint = 'bonuses?receiver_email=' + receiverEmailAddress + '&limit=' +
                        vm.limit + '&skip=0&access_token=' + vm.accessToken;
                    var fullUrl = _BASE_BONUSLY_API_URL + usersEndpoint;
                    var request = _formGETRequest();

                    return $http.get(fullUrl, request);
                }

                function _organizeBonuses(response) {
                    var bonuses = response.data.result;
                    angular.forEach(_BONUSLY_VALUES, function(value) {
                        vm.responses[value] = $filter('filter')(
                            bonuses,
                            {
                                value : value,
                                receiver: {
                                    username: receiverInfo.username
                                }
                            },
                            true
                        );
                    });
                    $location.hash('recognitions');
                    $anchorScroll();
                }

                function _hideSpinner() {
                    vm.loadingResults = false;
                }
            }

            function _clearData() {
                vm.displayName = undefined;
                vm.error = undefined;
                vm.responses = {};
                $location.hash('');
            }

            function _showError(error) {
                vm.error = error.data.message;
                apiAccessTokenStatus = error.status;
                vm.loadingResults = false;
            }

            function _formGETRequest() {
                var request = {};
                request.method = 'GET';
                request.headers = {
                    'Content-Type': 'application/json; charset=utf-8'
                };

                return request;
            }
        }

        function _getButtonText() {
            return _isReceiverEmailAddressDefined() ? _resolveEmailAddressLocalPart() + '`s' : 'your';


            function _resolveEmailAddressLocalPart() {
                return vm.userId.split('@')[0];
            }
        }

        function _hasAPIKey() {
            return apiAccessTokenStatus !== 401 && angular.isDefined(vm.accessToken) && vm.accessToken.length;
        }

        function _shouldDisplayTopReceiverText() {
            return vm.isTopOverlaying && JSON.stringify(vm.responses) !== '{}';
        }

        function _backToTop() {
            $location.hash('');
            $anchorScroll();
        }

        function _isReceiverEmailAddressDefined() {
            return angular.isDefined(vm.userId) && vm.userId.length
        }
    });
})();