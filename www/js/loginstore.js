angular.module('app100p.loginstore', ['ngOpenFB'])
    .factory('LoginStore', function($http, ngFB, $state){
        var logininit = [];
    
        var userdata = angular.fromJson(window.localStorage['userdata'] || logininit);
    
        function persist() {
            window.localStorage['userdata'] = angular.toJson(userdata);
        }
        
        return {
            
            loginFB: function() {
                console.log('Facebook login started');
                ngFB.login({scope: 'email'}).then(
                function (response) {
                    if (response.status === 'connected') {
                        console.log('Facebook login succeeded');
                        //$scope.closeLogin();
                        
                        $state.go('list');
                        
                    } else {
                        console.log('Facebook login failed');
                        //alert('Facebook login failed');
                    }
                });
            },
            
            getUserData: function(){
                ngFB.api({
                    path: '/me',
                    params: {fields: 'id,name,email,age_range,first_name,last_name,link,gender,locale,timezone,updated_time,verified'}
                }).then(
                    function (user) {
                        userdata = user;
                        persist();
                        return userdata;
                    },
                    function (error) {
                        //alert('Facebook error: ' + error.error_description);
                        return userdata;
                    });
                return userdata;
            },
            
           
        };
        
    });