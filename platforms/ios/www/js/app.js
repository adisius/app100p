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
    
    /*** APP CONTROLLERS ***/
    /***********************/
    
    //MENU CONTROLLER
    app.controller('MenuController', function ($scope, LoginStore) {
        $scope.user = LoginStore.getUserData();
        $scope.userid = $scope.user.id;
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
    app.controller('EditController', function($scope, $state, CuentosStore,$ionicHistory, $interval, $rootScope){
        
        $scope.viewTitle = 'Editar cuento';
        
        $scope.cuento = angular.copy(CuentosStore.get($state.params.cuentoIdc));
        
        $scope.saveCuento = function(){
            $scope.cuento.fecha_mod = new Date().getTime().toString();
            $scope.cuento.npalabras = $scope.contarPalabras($scope.cuento.cuento);
            CuentosStore.update($scope.cuento);
            $state.go('list');
        };
        
        $scope.formatPalabras = function(n){
            if(n == 0){
                return '0 palabras';
            } else if(n == 1){
                return '1 palabra';
            } else {
                return n + ' palabras';
            }
        }
        
        $scope.contarPalabras = function(text) {
            var s = text ? text.split(/\s+/) : 0;
            var l = s.length;
            if(l == undefined) l=0;
            return l;
        };
        
        $scope.stop = $interval( function(){
            $scope.np =  $scope.contarPalabras($scope.cuento.cuento);
            console.log($scope.np);
        }, 100);
        
        var dereg = $rootScope.$on('$locationChangeSuccess', function() {
            $interval.cancel($scope.stop);
            dereg();
          });
        
       // $scope.np = $scope.contarPalabras($scope.cuento.cuento);
        
        $scope.npalabras = $scope.formatPalabras($scope.np);
        
        $scope.setOverflowColor = function(){
            if($scope.np > 100){
                return 'overflow';
            } else {
                return '';
            }
        }
        
        
        
    });
    
    //ADD CONTROLLER
    app.controller('AddController', function($scope, $state, CuentosStore, $interval, $rootScope){

        $scope.viewTitle = 'Nuevo cuento';
        
        $scope.cuento = {
            idc: new Date().getTime().toString(),
            titulo: '',
            cuento: '',
            fecha_mod: new Date().getTime().toString()
        };
        
        $scope.saveCuento = function(){

            $scope.cuento.fecha_mod = new Date().getTime().toString();
            $scope.cuento.npalabras = $scope.contarPalabras($scope.cuento.cuento);
            CuentosStore.create($scope.cuento);
            $state.go('list');
        };
        
        $scope.formatPalabras = function(n){
            if(n == 0){
                return '0 palabras';
            } else if(n == 1){
                return '1 palabra';
            } else {
                return n + ' palabras';
            }
        }
        
        $scope.contarPalabras = function(text) {
            var s = text ? text.split(/\s+/) : 0;
            var l = s.length;
            if(l == undefined) l=0;
            return l;
        };
        
        $scope.stop = $interval( function(){
            $scope.np =  $scope.contarPalabras($scope.cuento.cuento);
            console.log($scope.np);
        }, 100);
        
        var dereg = $rootScope.$on('$locationChangeSuccess', function() {
            $interval.cancel($scope.stop);
            dereg();
          });
        
       // $scope.np = $scope.contarPalabras($scope.cuento.cuento);
        
        $scope.npalabras = $scope.formatPalabras($scope.np);
        
        $scope.setOverflowColor = function(){
            if($scope.np > 100){
                return 'overflow';
            } else {
                return '';
            }
        }
        
        
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