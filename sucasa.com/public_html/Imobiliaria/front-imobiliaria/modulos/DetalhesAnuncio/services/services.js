app.service('DetalhesAnunciosService',
    function($http, $templateRequest, $sce){
        this.getDetalhesAnuncio = function(idAnuncio){
            var urlS = 'http://localhost:8080/ofertaDet/'+idAnuncio;
            return  $http({
                method : 'GET',
                url : urlS

            });
        };

        this.getFotosAnuncio = function(idAnuncio){
            var urlS = 'http://localhost:8080/listarFotos/'+idAnuncio;
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