app.service('CredencialService',
    function($http, $templateRequest, $sce){
        this.cadastrar = function(dados){
            return  $http({
                method : 'POST',
                url : 'http://localhost:8080/cadastro',
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data : dados

            });
        };

        this.logar = function(dados){
            return  $http({
                method : 'POST',
                url : 'http://localhost:8080/login',
                headers : {
                    'Content-Type' : 'application/x-www-form-urlencoded'
                },
                data : dados

            });
        };

        this.getFooter = function(){
            var templateUrl = '';
         
            templateUrl = $sce.getTrustedResourceUrl('modulos/Footer/partials/footer.html');

            

            return $templateRequest(templateUrl);
        };

        

    }
);