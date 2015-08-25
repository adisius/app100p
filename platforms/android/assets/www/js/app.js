(function(){
    
    /*** APP MODULE ***/
    /******************/

    var app = angular.module('app100p', ['ionic', 'app100p.cuentosstore', 'truncate','angularMoment']);

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
            url: '/login',
            templateUrl: 'templates/login.html'
        });

        $urlRouterProvider.otherwise('/list');
        
        //BTN BACK CONFIG
        $ionicConfigProvider.backButton.previousTitleText(false);
        $ionicConfigProvider.backButton.icon('ion-chevron-left');
        $ionicConfigProvider.backButton.text('');
        
        //IN-APP BROWSER
         var defaultOptions = {
            location: 'no',
            clearcache: 'no',
            toolbar: 'no'
          };

        document.addEventListener(function () {
            $cordovaInAppBrowserProvider.setDefaultOptions(defaultOptions)
        }, false);
        
    });

    
    /*** GLOBAL VARS AND FUNCTIONS ***/
    /*********************************/
    
    
    /*** APP CONTROLLERS ***/
    /***********************/
    
    //LIST CONTROLLER
    app.controller('ListController', function ($scope, CuentosStore, $ionicActionSheet){
        
        $scope.reordering = false;
        $scope.cuentos = CuentosStore.list();
        
        $scope.remove = function(cuentoIdc){
            CuentosStore.remove(cuentoIdc);
        };
        
        $scope.postular = function(cuentoIdc){
            CuentosStore.postular(cuentoIdc);
        };
        
        $scope.move = function(cuento, fromIndex, toIndex){
            console.log('moving from ' + fromIndex + ' to ' + toIndex);
            CuentosStore.move(cuento, fromIndex, toIndex);
        };
        
        $scope.toggleReordering = function(){
            $scope.reordering = !$scope.reordering;
        };
        
    });

    //EDIT CONTROLLER
    app.controller('EditController', function($scope, $state, CuentosStore){

        $scope.viewTitle = 'Editar cuento';
        
        $scope.cuento = angular.copy(CuentosStore.get($state.params.cuentoIdc));
        
        $scope.saveCuento = function(){
            $scope.cuento.fecha_mod = new Date().getTime().toString();
            CuentosStore.update($scope.cuento);
            $state.go('list');
        };

    });
    
    //ADD CONTROLLER
    app.controller('AddController', function($scope, $state, CuentosStore){

        $scope.viewTitle = 'Nuevo cuento';
        
        $scope.cuento = {
            idc: new Date().getTime().toString(),
            titulo: '',
            cuento: '',
            fecha_mod: new Date().getTime().toString()
        };
        
        $scope.saveCuento = function(){
            CuentosStore.create($scope.cuento);
            $state.go('list')
        };

    });


    /*** APP RUN STUFF ***/
    /*********************/
    app.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
          
        if(window.cordova && window.cordova.InAppBrowser){
            window.open = window.cordova.InAppBrowser.open;
        }
          
        if(window.StatusBar) {
          StatusBar.styleDefault();
        }
          
      });
    })

}());