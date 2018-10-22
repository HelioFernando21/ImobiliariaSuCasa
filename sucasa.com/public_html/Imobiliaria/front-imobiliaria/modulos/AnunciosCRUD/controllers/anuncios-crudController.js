app.controller("anuncios-crudController", ['$scope', 'Upload', '$compile', '$timeout', 'AnunciosCrudService', '$filter', '$cookieStore','$stateParams', '$state', function($scope,Upload,$compile,$timeout, AnunciosCrudService, $filter, $cookieStore,$stateParams, $state){
    $scope.dadosUsuario = $cookieStore.get('dadosUsuario');
    if($scope.dadosUsuario){        
        $scope.logado = true;
    }else{
        $state.go('credencial');
    }

    $scope.deslogar = function(){
        $cookieStore.put('dadosUsuario','');
        $state.go('credencial');
    }

    AnunciosCrudService.getFooter().then(function (response) {
        $compile($("#footer").html(response).contents())($scope);
    });
    $scope.fotos = [];
    $scope.listaMeusAnuncios = [];

    $scope.anuncioToggle = function(index){
        $("#dsAdvertisementToggle"+index).slideToggle(360);
        if ($('#dsAdvertisementToggle'+index).hasClass('showUp')){
            $('.toggleDown'+index).css('display','block');
            $('.toggleUp'+index).css('display','none');
            $('#dsAdvertisementToggle'+index).removeClass('showUp');
            console.log('sumiu',$('#dsAdvertisementToggle'+index).has('.showUp').length);
            
        }else{ 
            console.log('aparceu',$('#dsAdvertisementToggle'+index).has('.showUp').length);           
            $('.toggleDown'+index).css('display','none');
            $('.toggleUp'+index).css('display','block'); 
            $('#dsAdvertisementToggle'+index).addClass('showUp');
        }
    }

    $scope.uploadFiles = function (file,index) {
        if(typeof file[0] === 'object'){
            getBase64(file[0],index);
        }
    }

    function getBase64(file,index) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            $timeout(function () {
                $scope.listaMeusAnuncios[index].fotos.push(reader.result); 
                console.log('subirFotos->',$scope.listaMeusAnuncios[index].fotos);                
            });  
            $timeout(function () {
                $('.materialboxed').materialbox();
            });          
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    };

    $scope.salvarAnuncio = function(index){
        
        if($scope.listaMeusAnuncios[index].novoAnuncio){
            $scope.listaMeusAnuncios[index].dia = '2018-06-12';
            $scope.listaMeusAnuncios[index].anunciante = $cookieStore.get('dadosUsuario').codigo;
            var dadosAnuncios = angular.copy($scope.listaMeusAnuncios[index]);
            delete dadosAnuncios.fotos;
            AnunciosCrudService.cadastrarOferta(dadosAnuncios, $cookieStore.get('dadosUsuario').codigo).then(function(response){
                $scope.listaMeusAnuncios[index].id = response.data.resp;
                if($scope.listaMeusAnuncios[index].fotos.length > 0){
                    $scope.salvarFotos($scope.listaMeusAnuncios[index].fotos,response.data.resp);
                }else{
                    Materialize.toast('Anúncio salvo com sucesso!', 5000);
                }
            });
        }else{
            if($scope.listaMeusAnuncios[index].fotos.length > 0){                
                $scope.salvarFotos($scope.listaMeusAnuncios[index].fotos,$scope.listaMeusAnuncios[index].id);
            }else{
                Materialize.toast('Anúncio salvo com sucesso!', 5000);
            }

            AnunciosCrudService.alterarAnuncio($scope.listaMeusAnuncios[index],$scope.listaMeusAnuncios[index].id,$cookieStore.get('dadosUsuario').codigo).then(function(response){
                console.log('responseSucessoAlterar->',response);
            }); 
        }
    }

    $scope.salvarFotos = function(dadosFotos,idOferta){
        AnunciosCrudService.salvarFotos(dadosFotos,idOferta).then(function(response){
            Materialize.toast('Anúncio salvo com sucesso!', 5000);
        },function(response){
            console.log('responseFotosErros->', response);
        });
    };

    

    $scope.adicionarAnuncio = function(){
        
        $scope.listaMeusAnuncios.push({novoAnuncio:true, fotos : []});
        $timeout(function () {
            $('select').material_select()
        });
        console.log('testee2121teste',$scope.listaMeusAnuncios);
    };

    
        
    

    $scope.excluirFoto = function(indexAnuncio,indexFoto){
        $scope.listaMeusAnuncios[indexAnuncio].fotos.splice(indexFoto,1);
    }

    $scope.listarAnuncios = function(){
        console.log('dadosUsuario->',$cookieStore.get('dadosUsuario'));
        AnunciosCrudService.getMeusAnuncios($cookieStore.get('dadosUsuario')).then(function(response){
            console.log('response21->',response);
            $scope.listaMeusAnuncios = response.data.resp;
            console.log('$scope.listaMeusAnuncios->',$scope.listaMeusAnuncios);
            AnunciosCrudService.getEstados().then(function(response){
                $scope.estados = response.data['resp.'];
                for(var i = 0; i < $scope.listaMeusAnuncios.length; i++){
                    $scope.listaMeusAnuncios[i].fotos = [];
                    console.log('ididididi->',$scope.listaMeusAnuncios[i]);
                    AnunciosCrudService.getFotosAnuncio($scope.listaMeusAnuncios[i].id).then(function(response){
                        console.log('response-SucessoFootos->',response);
                        var listaFotosAnuncio = [];
                        for(var i = 0; i < response.data.resp; i++){
                            listaFotosAnuncio.push('http://localhost:8080/static/img/'+$scope.listaMeusAnuncios[i].id+'/'+((i+1).toString()))
                            console.log('minhasFotos->',listaFotosAnuncio);
                        }   
                        $scope.listaMeusAnuncios[i].fotos = listaFotosAnuncio;                    
                        
                    });
                    console.log('testeI->',i);
                    console.log('$scope.listaMeusAnuncios->',$scope.listaMeusAnuncios[i]);
                    $scope.estadoChange(i);
                }
            });
            
            $timeout(function () {
                $('select').material_select()
            });
        },
        function(response) {
            console.log('response2121->',response);
        });      
    };

    $scope.estadoChange = function(index){
        if($scope.listaMeusAnuncios[index].estado != ''){
            var estadoSelec = $filter('filter')($scope.estados, {nome:$scope.listaMeusAnuncios[index].estado});
            estadoSelec = estadoSelec[0];
            AnunciosCrudService.getCidades(estadoSelec.id).then(function(response){
                $scope.listaMeusAnuncios[index].cidades = response.data.resp;       
                
                $timeout(function () {
                    $('select').material_select()
                });
            });
        }
    };

    

    $scope.listarAnuncios();

    


}]);