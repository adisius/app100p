angular.module('app100p.perfilstore', [])
    .factory('PerfilStore', function($http, $ionicActionSheet){
        var perfilinit = [
            {
                "idu": "5",
                "rut": "13.279.290-9",
                "nombre": "Andrés",
                "apellido": "Becker",
                "sexo": "M",
                "email": "andres@plagio.cl",
                "direccion": "Pontevedra 6860",
                "pais": "Chile",
                "region": "XIII",
                "comuna": "La Reina",
                "telefono": "99370480"
            }
        ];
    
        var perfil = angular.fromJson(window.localStorage['perfil'] || perfilinit);
    
        function persist() {
            window.localStorage['perfil'] = angular.toJson(perfil);
        }
    
        return {
            list: function() {
                return cuentos;
            },
            
            get: function(cuentoId){
                for (var i = 0; i < cuentos.length; i++) {
                    if (cuentos[i].idc === cuentoId) {
                        return cuentos[i];
                    }
                }
                return undefined;
            },
            
            create: function(cuento) {
                cuentos.push(cuento);
                persist();
            },
            
            update: function(cuento){
                for (var i = 0; i < cuentos.length; i++) {
                    if (cuentos[i].idc === cuento.idc) {
                        cuentos[i] = cuento;
                        persist();
                        return;
                    }
                }
            }, 
            
            move: function(cuento, fromIndex, toIndex){
                cuentos.splice(fromIndex, 1);
                cuentos.splice(toIndex, 0, cuento);
                persist;
            },
            
            remove: function(cuentoId){
                for (var i = 0; i < cuentos.length; i++) {
                    if (cuentos[i].idc === cuentoId) {
                        cuentos.splice(i, 1);
                        persist();
                        return;
                    }
                }
            }, 
            
            openurl: function(url){
                var ref = window.open(url, '_blank','location=no,closebuttoncaption=X,toolbar=yes,presentationstyle=fullscreen ,transitionstyle=coververtical');
            },
            
            postular: function(cuento){
                var vars = "?titulo=" + window.btoa(cuento.titulo) + "&cuento=" + window.btoa(cuento.cuento);
                $ionicActionSheet.show({
                  titleText: 'Recuerda que solo puedes postular en tu región de residencia, con excepción de Santiago en 100 Palabras.',
                  buttons: buttonsGroup,
                  cancelText: 'Cancelar',
                  buttonClicked: function(index) {
                    openURL(urlconvocatorias[index]+"/appgcuento.php"+vars);
                    return true;
                  }
                });
            }
            

        };
        
    });