app.service('BuscaService',
    function($http, $templateRequest, $sce){
        this.getEstados = function(){
            console.log('testetes212121');
            return  $http({
                method : 'GET',
                url : 'http://localhost:8080/estados'

            });
        };

        this.buscarAnuncio = function(dadosEntrada,paginacao){
            return  $http({
                method : 'POST',
                url : ('http://localhost:8080/Busca/'+paginacao),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data : dadosEntrada

            });
        };

        this.getCidades = function(idEstado){
            var urlS = 'http://localhost:8080/cidades/'+idEstado+'/estado';
            console.log('url->',urlS);
            return  $http({
                method : 'GET',
                url : urlS

            });
        };

        this.getFooter = function(){
            var templateUrl = '';
         
            templateUrl = $sce.getTrustedResourceUrl('modulos/Footer/partials/footer.html');

            

            return $templateRequest(templateUrl);
        };

        

    }
);