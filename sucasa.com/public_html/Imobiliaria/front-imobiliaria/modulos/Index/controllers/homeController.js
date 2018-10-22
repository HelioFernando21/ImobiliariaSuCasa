app.controller("homeController", ['$scope',  '$compile', '$stateParams', '$state','HomeService', '$cookieStore', function($scope, $compile, $stateParams, $state, HomeService, $cookieStore){
    $scope.dadosUsuario = $cookieStore.get('dadosUsuario');
    if($scope.dadosUsuario){        
        $scope.logado = true;
    }else{
        $scope.logado = false;
    }

    $scope.listaAnuncios = [];

    $scope.deslogar = function(){
        $cookieStore.put('dadosUsuario','');
        $state.go('credencial');
    }

    HomeService.getFooter().then(function (response) {
        $compile($("#footer").html(response).contents())($scope);
    });

    $scope.buscarImoveis = function(tipo){
        $state.go('busca',{tipo : tipo});
    }

    $scope.detalhesAnuncio = function(id){
        $state.go('anuncio',{id : id});
    }

    HomeService.getAnunciosRecentes().then(function(response){

        $scope.listaAnuncios = response.data.resp;
    });

    $scope.numberToReal = function(numero) {
        var numero = numero.toString();
        numero = numero.split(/(?=(?:...)*$)/).join('.');
        return numero;
    }


}]);