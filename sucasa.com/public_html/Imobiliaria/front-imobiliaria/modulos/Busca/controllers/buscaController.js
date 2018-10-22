app.controller("buscaController", ['$scope','Upload', '$timeout', '$cookieStore', 'BuscaService', '$compile', '$stateParams', '$state', '$filter',function($scope,Upload, $timeout, $cookieStore, BuscaService, $compile, $stateParams, $state, $filter){
    $scope.dadosUsuario = $cookieStore.get('dadosUsuario');
    if($scope.dadosUsuario){        
        $scope.logado = true;
    }else{
        $scope.logado = false;
    }

    $scope.listaBuscaOferta = [];

    $scope.deslogar = function(){
        $cookieStore.put('dadosUsuario','');
        $state.go('credencial');
    }

    $scope.pagination = 1;

    $scope.filters = {
        estado : '',
        cidade : '',
        tipoOferta :'',
        tipoMoradia :'',
    };
    console.log('stateParams->',$stateParams.tipo);
    if(!$stateParams.tipo){
        $scope.filters.tipoOferta = "Venda";
    }else{
        if($stateParams.tipo == "1")
            $scope.filters.tipoOferta = "Venda";
        else
            $scope.filters.tipoOferta = "Aluguel";
    }

    $scope.cidades = [];
    $scope.testeImagem = '';

    BuscaService.getFooter().then(function (response) {
        $compile($("#footer").html(response).contents())($scope);
    });    

    $scope.estadoChange = function(){
        console.log('passouaqui',$scope.filters.estado );
        if($scope.filters.estado != ''){
            console.log('teste21->');
            BuscaService.getCidades($scope.filters.estado).then(function(response){
                $scope.cidades = response.data.resp;       
                
                 $timeout(function () {
                    $('select').material_select()
                 });
            });
        }
    };

    BuscaService.getEstados().then(function(response){

        $scope.estados = response.data['resp.'];
        console.log('estados',$scope.estados);
    });

    $scope.detalhesAnuncio = function(id){
        $state.go('anuncio',{id : id});
    }

    $scope.preco = {
        value: 400000,
        options: {
            showSelectionBar: true,
            step: 1,
            floor: 0,
            ceil: 400000,
            translate: function(value, sliderId, label) {
                switch (label) {
                    case 'model':
                    return (value >= 400000 ? 'R$ +' : 'R$ ') + numberToReal(value);
                    case 'high':
                    return (value >= 400000 ? 'R$ +' : 'R$ ') +numberToReal(value);
                    default:
                    return (value >= 400000 ? 'R$ +' : 'R$ ') + numberToReal(value)
                }
            }
        }
    };

    $scope.preco.minValue = 400000;

    $scope.espaco = {
        value: 10,
        options: {
            showSelectionBar: true,
            ceil:400000,
            flor:0,
            step: 1,
            translate: function(value, sliderId, label) {
                switch (label) {
                    case 'model':
                    return (value >= 400000 ? '+' : '') + numberToReal(value) + ' m²';
                    case 'high':
                    return (value >= 400000 ? '+' : '') +numberToReal(value) + ' m²';
                    default:
                    return (value >= 400000 ? '+' : '') + numberToReal(value) + ' m²'
                }
            }
        }
    };

    $scope.espaco.minValue = 400000;

    $scope.quartos = {
        value: 1,
        options: {
            floor: 1,
            ceil: 4,
            showTicksValues: true,
            translate: function(value, sliderId, label) {
                switch (label) {
                    case 'model':
                    return (value >= 4 ? '+' : '') + value;
                    case 'high':
                    return (value >= 4 ? '+' : '') + value;
                    default:
                    return (value >= 4 ? '+' : '') + value
                }
            }
        }
    };
    $scope.quartos.minValue = 1;

    $scope.vagasEstacionamento = {
        value: 1,
        options: {
            floor: 1,
            ceil: 4,
            showTicksValues: true,
            translate: function(value, sliderId, label) {
                switch (label) {
                    case 'model':
                    return (value >= 4 ? '+' : '') + value;
                    case 'high':
                    return (value >= 4 ? '+' : '') + value;
                    default:
                    return (value >= 4 ? '+' : '') + value
                }
            }
        }
    };
    $scope.vagasEstacionamento.minValue = 1;
    
    function numberToReal(numero) {
        var numero = numero.toString();
        numero = numero.split(/(?=(?:...)*$)/).join('.');
        return numero;
    }

    $scope.teste = function(){
        console.log('teste->',$scope.minRangeSlider.maxValue);
    }


    $scope.uploadFiles = function (file) {
        console.log('file',file[0]);
        getBase64(file[0]);

    }

    function getBase64(file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            $timeout(function () {
                $scope.testeImagem = reader.result;
            });           
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    $scope.numberToReal = function(numero) {
        var numero = numero.toString();
        numero = numero.split(/(?=(?:...)*$)/).join('.');
        return numero;
    }

    $scope.buscarAnuncios = function(){
        var codigoEstado =  $filter('filter')($scope.estados,{id : $scope.filters.estado});
        var codigoCidade =  $filter('filter')($scope.cidades,{id : $scope.filters.cidade});

        var dadosEntrada = {
            'tipoproposta' : $scope.filters.tipoOferta.toString(),
            'tipomoradia' : $scope.filters.tipoMoradia.toString(),
            'preco' : $scope.preco.minValue.toString(),
            'espaco' : $scope.espaco.minValue.toString(),
            'numeroquartos' : $scope.quartos.minValue.toString(),
            'vagasestacionamento' : $scope.vagasEstacionamento.minValue.toString(),
            'cidade' : codigoCidade[0].nome.toString(),
            'estado' : codigoEstado[0].nome.toString()
        };
        
        BuscaService.buscarAnuncio(dadosEntrada,$scope.pagination).then(function(response){
            console.log('responseBusca->',response);
            $scope.listaBuscaOferta = response.data.resp;
        });
    }

    $scope.paginacao = function(tipo){
        if(tipo == 1){
            $scope.pagination = parseInt($scope.pagination) + 1;
        }else{
            $scope.pagination = parseInt($scope.pagination) -1;
        }
    };




}]);