app.controller("credencialController", ['$scope',  '$compile', '$stateParams', '$state','CredencialService', '$cookieStore', function($scope, $compile, $stateParams, $state, CredencialService, $cookieStore){
    $scope.dadosLogin = {
    	email : '',
    	senha : ''
    };

    $scope.dadosUsuario = $cookieStore.get('dadosUsuario');
    if($scope.dadosUsuario){
    	$state.go('meusanuncios');
    	$scope.logado = true;
    };

    $scope.dadosCad = {
    	nome : '',
    	dtNascimento : '',
    	email : '',
    	telefone : '',
    	senha : '',
    	confSenha : ''
    };

    CredencialService.getFooter().then(function (response) {
        $compile($("#footer").html(response).contents())($scope);
    });

    

    $scope.cadastrar = function(){
    	delete $scope.dadosCad.confSenha;
    	CredencialService.cadastrar($scope.dadosCad).then(function (response) {
	        $scope.logarRest($scope.dadosCad);
	    },function(response){
	    	Materialize.toast('Preencha todos os campos!', 5000);
	    });
    };

    $scope.logar = function(){
    	$scope.logarRest($scope.dadosLogin);
    };

    $scope.logarRest = function(dadosLogin){
    	CredencialService.logar(dadosLogin).then(function (response) {

	        
	        $cookieStore.put('dadosUsuario',({
	        	codigo : response.data.resp[0],
	        	email : response.data.resp[1],
	        	nome : response.data.resp[2],
	        	token : response.data.resp[3],
	        	nomeBarra : (' '+(response.data.resp[2]).substr(0, 11))
	        }));
	        $state.go('meusanuncios');
	        


	    },function(response){
	    	Materialize.toast('Login ou Senha incorretos!', 5000);
	    });
    };



}]);