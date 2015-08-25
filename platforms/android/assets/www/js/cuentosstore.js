angular.module('app100p.cuentosstore', [])
    .factory('CuentosStore', function($http, $ionicActionSheet){
        var cuentosinit = [
            {
                "idc": "5",
                "titulo": "Mi hijo se fue.",
                "cuento": "El polvo sí que mata.",
                "fecha_mod": "1436734669"
            },
            {
                "idc": "4",
                "titulo": "Callejeros",
                "cuento": "La calle es nuestro hogar, somos fieles, somos buenos amigos, el mejor para muchos, pero no tan afortunados, como algunos de nuestros semejantes... qué, no daríamos muchas veces por un sorbo de agua...tratamos de sobrevivir, comiendo en ocasiones, lo que no nos gusta...recibimos golpes e insultos de personas que se creen civilizadas...varios de nosotros alguna vez tuvimos hogar, un nombre, un amo...recuerdo que siempre le sacaba una sonrisa, moviendo mi cola...un día llegó un cachorro, era de raza pequeña, decían...las preferencias se notaron...empezó a faltar el cariño, el alimento...nadie me sonreía...hasta que un día, decidí marcharme y ser un callejero.",
                "fecha_mod": "1436734664"
            },
            {
                "idc": "3",
                "titulo": "El Calamina",
                "cuento": "Siendo muy joven, comencé a trabajar en la Fundición Playa Blanca o Huanchaca como ayudante de un señor que tiraba pala todo el día y echaba muchos garabatos mientras se escupía las manos cada vez que empuñaba la pala. Me gustaba mirarlo y trataba, con mi flacuchento esqueleto, de hacer los mismos movimientos que él, causando su risa y tallas que, parecía, hacían más grato su duro trabajo, si ello fuese posible; \"ya puh Calamina, pónele más empeño\" me decía cundo veía que yo, cansado como perro, dejaba a un lado la pala que, para mí, era un monstruo insaciable.",
                "fecha_mod": "1436734491"
            },
            {
                "idc": "2",
                "titulo": "MI LINDO PASEO POR EL BORDE COSTERO DE ANTOFAGASTA.",
                "cuento": " Cuando camino por todo el borde costero, me siento muy feliz, ya que me relaja mucho, se me olvidan los problemas rutinarios, siento que me enriquece muucho al darme un paseito a las orillas del mar, todo esto para mi es una terápia. Antofagasta es una ciudad que tiene bastantes riquezas en el borde costero. Disfrutar del mar me hace bien, me da vitalidad y me mantiene felíz, nuestra naturaleza es lo más importante en la vida en general. Me encanta caminar por el paseo del mar, ya que he descubierto que la naturaleza es lo mejor para todos.",
                "fecha_mod": "1436734465"
            },
            {
                "idc": "1",
                "titulo": "La mano del tiempo",
                "cuento": "La unión y el sonido del mar, el silencio del desierto que une sus curvas de una cadena de cerros de color grises, que muestra la tristeza y la alegría de cada ciudadano, los personajes que son punto vital del centro de la ciudad es una marca que hace antofagasta una ciudad distinta, como cantantes, dibujante y artistas que pintan el centro, es una entretención de punta a punta, los cambios contantes que tiene nuestra ciudad es un cambio de evolución y de grandeza, podemos ver todo estos cambios de ciudadanos que podemos aprender a convivir así, como buen antofastino.",
                "fecha_mod": "1436734428"
            }
        ];
    
        var cuentos = angular.fromJson(window.localStorage['cuentos'] || cuentosinit);
        //var cuentos = cuentosinit; //TEMP CALL
    
        function persist() {
            window.localStorage['cuentos'] = angular.toJson(cuentos);
        }
    
    
        var convocatorias = [];
        var btnconvocatorias = [];
        var urlconvocatorias = [];
        var buttonsGroup = [];
        
        getConvocatorias();
    
        function getConvocatorias(){
            var convocatorias = [];
            
            $http.get('http://100papp.plagio.cl/api/gconvocatorias')
              .success(function(response) {
                angular.forEach(response, function(child) {
                    
                    var text = {"text":child.nombre};
                    buttonsGroup.push(text);
                    
                    var convocatoria = child;
                    convocatorias.push(convocatoria);
                    urlconvocatorias.push(convocatoria.url);
                });
              });
        }
    
        function openURL(url){
            window.open(url, '_blank', 'location=yes','closebuttoncaption=volver');
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
            
            postular: function(cuentoId){
                $ionicActionSheet.show({
                  titleText: 'Recuerda que solo puedes postular en tu región de residencia, con excepción de Santiago en 100 Palabras.',
                  buttons: buttonsGroup,
                  cancelText: 'Cancelar',
                  buttonClicked: function(index) {
                    openURL(urlconvocatorias[index]);
                    //console.log(urlconvocatorias[index]);
                    return true;
                  }
                });
            }
            

        };
        
    });