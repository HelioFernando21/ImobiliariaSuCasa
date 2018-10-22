app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl : "modulos/Index/partials/home.html"
        })
        .state('credencial', {
            url: '/credencial',
            templateUrl : "modulos/Credencial/partials/credencial.html"
        })
        .state('busca', {
            url: '/busca?tipo',
            templateUrl : "modulos/Busca/partials/busca.html"
        })
        .state('meusanuncios', {
            url: '/meusanuncios',
            templateUrl : "modulos/AnunciosCRUD/partials/anuncios-crud.html"
        })
        .state('anuncio', {
            url: '/anuncio?id',
            templateUrl : "modulos/DetalhesAnuncio/partials/detalhes-anuncio.html"
        })
       
    $urlRouterProvider.otherwise('/home');
});

