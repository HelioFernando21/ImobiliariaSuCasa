app.controller("detalhes-anuncioController", ['$scope', 'DetalhesAnunciosService',  '$compile', '$stateParams', '$state', '$cookieStore', '$timeout', function($scope, DetalhesAnunciosService, $compile, $stateParams, $state, $cookieStore, $timeout){
	$scope.dadosUsuario = $cookieStore.get('dadosUsuario');
    if($scope.dadosUsuario){        
        $scope.logado = true;
    }else{
        $scope.logado = false;
    }

    $scope.deslogar = function(){
        $cookieStore.put('dadosUsuario','');
        $state.go('credencial');
    }

	DetalhesAnunciosService.getFooter().then(function (response) {
        $compile($("#footer").html(response).contents())($scope);
    });
     
    $('.slider').slider({
        interval: 900000
    });

    $scope.next = function(){
        $('.slider').slider('next');
    };

    $scope.idAnuncio = $stateParams.id;
    console.log('testeDetalhes->',$stateParams.id);
    DetalhesAnunciosService.getDetalhesAnuncio($scope.idAnuncio).then(function(response){
    	console.log('responseDetalhes->',response);
    	$scope.dadosAnuncio = response.data.resp;
        $scope.telefoneContato = response.data.telefone;
    	$scope.dadosAnuncio.valor = numberToReal($scope.dadosAnuncio.valor); 
    });

    DetalhesAnunciosService.getFotosAnuncio($scope.idAnuncio).then(function(response){
        $scope.listaFotosAnuncio = [];
        for(var i = 0; i < response.data.resp; i++){
            $scope.listaFotosAnuncio.push('http://localhost:8080/static/img/'+$scope.idAnuncio+'/'+((i+1).toString()))
            console.log('minhasFotos->',$scope.listaFotosAnuncio);
        }
        
        $timeout(function () {
            $('.slider').slider();
        }); 
    });

    function numberToReal(numero) {
        var numero = numero.toString();
        numero = numero.split(/(?=(?:...)*$)/).join('.');
        return numero;
    }

    function formatReal( int )
	{
        var tmp = int+'';
        tmp = tmp.replace(/([0-9]{2})$/g, ",$1");
        if( tmp.length > 6 )
                tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

        return tmp;
	}

}]);