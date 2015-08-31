(function(){
    
    /*** APP MODULE ***/
    /******************/

    var app = angular.module('app100p', ['ionic', 'app100p.cuentosstore', 'truncate','angularMoment','app100p.perfilstore', 'app100p.loginstore', 'ngOpenFB']);

    /*** APP CONFIG ***/
    app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider){

        //LISTA DE CUENTOS
        $stateProvider.state('list', {
            url: '/list',
            templateUrl: 'templates/list.html'
        });

        //EDITAR CUENTO
        $stateProvider.state('edit', {
            url: '/edit/:cuentoIdc',
            templateUrl: 'templates/edit.html',
            controller: 'EditController'
        });
        
        //CREAR CUENTO
        $stateProvider.state('add', {
            url: '/add',
            templateUrl: 'templates/edit.html',
            controller: 'AddController',
            viewTitle: 'Crear'
        });
        
        $stateProvider.state('login', {
            url: '/app/login',
            templateUrl: 'templates/login.html',
            controller: 'LoginController'
        });
        
        $stateProvider.state('signup', {
            url: '/signup',
            templateUrl: 'templates/signup.html',
            controller: 'SignUpController'
        });
        
        $stateProvider.state('perfil', {
            url: '/perfil',
            templateUrl: 'templates/perfil.html',
            controller: 'PerfilController'
        });
        
        $stateProvider.state('profile', {
            url: "/profile",
            templateUrl: "templates/profile.html",
            controller: "ProfileCtrl"
        });

        $urlRouterProvider.otherwise('/app/login');
        
        //BTN BACK CONFIG
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('');        
        
    });

    
    /*** GLOBAL VARS AND FUNCTIONS ***/
    /*********************************/
    //$rootScope.loggedIn;
    
    
    /*** APP SERVICES ***/
    /********************/
    app.service('cuentoServices', function(){
       
        var self = this;
        
        this.formatPalabras = function(n){
            if(n == 0){
                return '0 palabras';
            } else if(n == 1){
                return '1 palabra';
            } else {
                return n + ' palabras';
            }
        }
        
        this.contarPalabras = function(text) {
            var s = text ? text.split(/\s+/) : 0;
            var l = s.length;
            if(l == undefined) l=0;
            return l;
        };
        
    });
    
    app.service('signupServices', function(){
       
        var self = this;
        
    });
    
    /*** APP CONTROLLERS ***/
    /***********************/
    
    //SIGNUP CONTROLLER
    app.controller('SignUpController', function ($scope, signupServices) {
        $scope.nombre = '';
        $scope.apellido = '';
        $scope.email = '';
        $scope.clave = '';
        $scope.clave2 = '';
        
        $scope.checkValidPassword = function(str1){
            if(str1 != undefined){
                if(str1.length >= 6){
                    console.info("valid!");
                    return true;
                } else {
                    console.info("invalid!");
                    return false;
                }
            }
        }
        
        $scope.checkValidPasswords = function(str1, str2){
            if(str1 == str2 && str1 != ""){
                console.info("equals!");
                return true;
            } else {
                console.info("different!");
                return false;
            }
        }
        
        $scope.checkValidEmail = function(str){
            if(str != undefined){
                var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
                return re.test(str);
            }
        }
        
        $scope.checkValidText = function(str){
            if(str != undefined){
                if(str.length >= 2){
                    console.info("valid!");
                    return true;
                } else {
                    console.info("invalid!");
                    return false;
                }
            }
        }
        
        $scope.sendForm;
        
    });
    
    //MENU CONTROLLER
    app.controller('MenuController', function ($scope, PerfilStore) {
        $scope.user = PerfilStore.get();
        $scope.nombre = $scope.user[0].nombre;
        $scope.imageurl = "http://app.en100palabras.com/images/profile/" + $scope.user[0].idu + ".png";
    });
    
    //LIST CONTROLLER
    app.controller('ListController', function ($scope, CuentosStore, $ionicActionSheet, $ionicListDelegate, $rootScope){
        
        $rootScope.showMenuBtn = true;
        
        $scope.reordering = false;
        $scope.cuentos = CuentosStore.list();
        
        $scope.remove = function(cuentoIdc){
            CuentosStore.remove(cuentoIdc);
        };
        
        $scope.postular = function(cuentoIdc){
            CuentosStore.postular(CuentosStore.get(cuentoIdc));
            $ionicListDelegate.closeOptionButtons();
        };
        
        $scope.move = function(cuento, fromIndex, toIndex){
            console.log('moving from ' + fromIndex + ' to ' + toIndex);
            CuentosStore.move(cuento, fromIndex, toIndex);
        };
        
        $scope.toggleReordering = function(){
            $scope.reordering = !$scope.reordering;
        };
        
        $scope.openurl = function(url){
            CuentosStore.openurl(url);
        }
        
    });

    //EDIT CONTROLLER
    app.controller('EditController', function($scope, $state, CuentosStore,$ionicHistory, $interval, $rootScope, cuentoServices){
        
        $scope.viewTitle = 'Editar cuento';
        
        $scope.cuento = angular.copy(CuentosStore.get($state.params.cuentoIdc));
        
        $scope.saveCuento = function(){
            $scope.cuento.fecha_mod = new Date().getTime().toString();
            $scope.cuento.npalabras = cuentoServices.contarPalabras($scope.cuento.cuento);
            CuentosStore.update($scope.cuento);
            $state.go('list');
        };
        
        $scope.np = cuentoServices.contarPalabras($scope.cuento.cuento);
        $scope.npalabras = cuentoServices.formatPalabras($scope.np);
        
        $scope.$watch('cuento.cuento', function(){
            $scope.np = cuentoServices.contarPalabras($scope.cuento.cuento);
            $scope.npalabras = cuentoServices.formatPalabras($scope.np);
        });
        
    });
    
    //ADD CONTROLLER
    app.controller('AddController', function($scope, $state, CuentosStore, $interval, $rootScope, cuentoServices){

        $scope.viewTitle = 'Nuevo cuento';
        
        $scope.cuento = {
            idc: new Date().getTime().toString(),
            titulo: '',
            cuento: '',
            fecha_mod: new Date().getTime().toString()
        };
        
        $scope.saveCuento = function(){

            $scope.cuento.fecha_mod = new Date().getTime().toString();
            $scope.cuento.npalabras = cuentoServices.contarPalabras($scope.cuento.cuento);
            CuentosStore.create($scope.cuento);
            $state.go('list');
        };
        
        $scope.np = cuentoServices.contarPalabras($scope.cuento.cuento);
        $scope.npalabras = cuentoServices.formatPalabras($scope.np);
        
        $scope.$watch('cuento.cuento', function(){
            $scope.np = cuentoServices.contarPalabras($scope.cuento.cuento);
            $scope.npalabras = cuentoServices.formatPalabras($scope.np);
        });
        
    });
    
    //Perfil CONTROLLER
    app.controller('PerfilController', function($scope, $state, PerfilStore, LoginStore){
        $scope.viewTitle = 'Mi Perfil';
        
        $scope.user = LoginStore.getUserData();
        
        console.log(LoginStore.getUserData());
        
    });
    
    app.controller('ProfileCtrl', function ($scope, LoginStore) {
        $scope.user = LoginStore.getUserData();
        console.log($scope.user);
    });

    //LOGIN CONTROLLER
    app.controller('LoginController', function($scope, $state, LoginStore, ngFB, $ionicHistory, $rootScope){
        
        $rootScope.showMenuBtn = false;
        
        $ionicHistory.nextViewOptions({
            historyRoot: true
        });
        
        $scope.viewTitle = 'Login';    
        
        $scope.loginFB = function(){
            LoginStore.loginFB();
        }        
        
    });

    
    /*** APP RUN STUFF ***/
    /*********************/
    app.run(function($ionicPlatform, ngFB) {
        
        $ionicPlatform.ready(function() {
            ngFB.init({appId: '122981921374669'});
            /* if(window.cordova && window.cordova.plugins.Keyboard) {
              cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            } */

            if(window.cordova && window.cordova.InAppBrowser){
                window.open = window.cordova.InAppBrowser.open;
            }

            if(window.StatusBar) {
                StatusBar.styleDefault();
            }
          
      });
    })

}());