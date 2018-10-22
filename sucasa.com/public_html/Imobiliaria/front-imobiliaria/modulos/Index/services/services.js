app.service('HomeService',
    function($http, $templateRequest, $sce){
        this.getAnunciosRecentes = function(){
            var urlS = 'http://localhost:8080/home';
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