app.service('AnunciosCrudService',
    function($http, $templateRequest, $sce){
        this.getMeusAnuncios = function(dadosUsuario){
            var urlS = 'http://localhost:8080/meusanuncios/'+dadosUsuario.codigo;
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

        this.getEstados = function(){
            console.log('testetes212121');
            return  $http({
                method : 'GET',
                url : 'http://localhost:8080/estados'

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

        this.cadastrarOferta = function(dados, idUsuario){
            return  $http({
                method : 'POST',
                url : ('http://localhost:8080/oferta/'+idUsuario),
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data : dados

            });
        };

        this.salvarFotos = function(dados, idOferta){      
            console.log('dadosFotos->',dados);
            return  $http({
                method : 'POST',
                url : ('http://localhost:8080/foto/'+idOferta),
                headers : {
                     'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
                },
                data : dados

            });
        }; 


        this.alterarAnuncio = function(dados, idOferta, idUsuario){
            
            return  $http({
                method : 'PUT',
                url : ('http://localhost:8080/crudOferta/'+idOferta+'/'+idUsuario),
                headers : {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                data : dados

            });
        };
        

    }
);