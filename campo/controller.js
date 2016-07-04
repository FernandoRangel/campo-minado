var app = angular.module('campo', []);
app.controller('campoCtrl', function ($scope) {

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    };

    $scope.range = function(max) {
        var input = [];
        for (var i = 0; i < max; i ++) {
            input.push(i);
        }
        return input;
    };

    function validaPosicao(posicoes, posicao) {
        var achou = false;
        angular.forEach(posicoes, function(value, key) {
            if (value.linha == posicao.linha && value.coluna == posicao.coluna) {
                achou = true;
            }
        });
        return !achou;
    };

    function initBombas() {
        $scope.posicoesBombas = [];
        var novaPosicao = {};
        for (var i = 0; i < $scope.bombas; i ++) {
            novaPosicao = {linha: getRandomInt($scope.linhas), coluna: getRandomInt($scope.colunas)};
            if ($scope.posicoesBombas.length > 0) {
                var loop = true;
                while(loop) {
                   if (validaPosicao($scope.posicoesBombas, novaPosicao)) {
                        loop = false;
                        $scope.posicoesBombas.push(novaPosicao);
                    } else {
                        novaPosicao = {linha: getRandomInt($scope.linhas), coluna: getRandomInt($scope.colunas)};
                    } 
                }                
            } else {
                $scope.posicoesBombas.push(novaPosicao);
            }
        }
    };

    function getCampo(linha, coluna) {
        var achoCampo = null;
        angular.forEach($scope.campos, function(campo, index) {
            if (linha == campo.linha && coluna == campo.coluna) {
                achoCampo = campo;
            }
        });
        return achoCampo;
    }

    function setValores() {
        angular.forEach($scope.campos, function (campo, index) {
            if (!campo.bomba) {
                var valor = null;
                var linha = campo.linha;
                var coluna = campo.coluna;
                camposEmVolta = [
                    {linha: linha - 1, coluna: coluna - 1},
                    {linha: linha - 1, coluna: coluna},
                    {linha: linha - 1, coluna: coluna + 1},
                    {linha: linha, coluna: coluna - 1},
                    {linha: linha, coluna: coluna + 1},
                    {linha: linha + 1, coluna: coluna - 1},
                    {linha: linha + 1, coluna: coluna},
                    {linha: linha + 1, coluna: coluna + 1}
                ];
                angular.forEach(camposEmVolta, function (object, index2) {
                    var objectCampo = getCampo(object.linha, object.coluna);
                    if (objectCampo && objectCampo.bomba) {
                        valor++;
                    }
                });
                campo.valor = valor;
            }
        });
    }

    function initTabuleiro() {
        $scope.campos = [];
        for (var lin = 0; lin < $scope.linhas; lin++) {
            for (var col = 0; col < $scope.colunas; col++) {
                var temBomba = false;
                angular.forEach($scope.posicoesBombas, function(bomba, indexB) {
                    if (lin == bomba.linha && col == bomba.coluna) {
                        temBomba = true;
                    }
                });
                $scope.campos.push({linha: lin, coluna: col, bomba: temBomba, aberto: false});
            }
        }
    };

    function abreTabuleiro(status) {
        if (status == "perdeu") {
            angular.forEach($scope.campos, function (campo, index) {
                campo.aberto = true;
            });
            $scope.jogo.perdeu = true;
            $('.tabuleiro').addClass("bloquear-clique");
        }
    }

    function abreCamposVazios(campo) {
        var arrayCamposVazios = [];
        var arrayCamposVerificados = [];
        if (!campo.valor) {
            arrayCamposVazios.push({linha: campo.linha, coluna: campo.coluna});
        }
        while(arrayCamposVazios.length != 0) {
            angular.forEach(arrayCamposVazios, function (campoVazio, index) {
                var linha = campoVazio.linha;
                var coluna = campoVazio.coluna;
                camposEmVolta = [
                    {linha: linha - 1, coluna: coluna - 1},
                    {linha: linha - 1, coluna: coluna},
                    {linha: linha - 1, coluna: coluna + 1},
                    {linha: linha, coluna: coluna - 1},
                    {linha: linha, coluna: coluna + 1},
                    {linha: linha + 1, coluna: coluna - 1},
                    {linha: linha + 1, coluna: coluna},
                    {linha: linha + 1, coluna: coluna + 1}
                ];
                angular.forEach(camposEmVolta, function (object) {
                    var objectCampo = getCampo(object.linha, object.coluna);
                    if (objectCampo) {
                        objectCampo.aberto = true;
                        if (!objectCampo.valor) {
                            if (validaPosicao(arrayCamposVazios, objectCampo) && validaPosicao(arrayCamposVerificados, objectCampo)) {
                                arrayCamposVazios.push({linha: objectCampo.linha, coluna: objectCampo.coluna});
                            }
                        }
                    }
                });
                var abreCampo = getCampo(campoVazio.linha, campoVazio.coluna);
                abreCampo.aberto = true;
                arrayCamposVazios.splice(index, 1);
                arrayCamposVerificados.push({linha: abreCampo.linha, coluna: abreCampo.coluna});
            });
        }
    }

    $scope.clickCampo = function (campo) {
        if (!campo.marcado) {
            if (campo.bomba) {
                abreTabuleiro("perdeu");
            }
            campo.aberto = true;
            abreCamposVazios(campo);
        }
    }
    $scope.marcaCampo = function (campo) {
        if (!campo.aberto) {
            campo.marcado = !campo.marcado;
            if (campo.marcado) {
                $scope.bombas--;
            } else {
                $scope.bombas++;
            }
        }
    }
    $scope.reiniciarJogo = function () {
        $scope.linhas = 20;
        $scope.colunas = 20;
        $scope.bombas = 60;
        $scope.jogo = {};
        
        initBombas();
        initTabuleiro();
        setValores();

        $('.tabuleiro').removeClass("bloquear-clique");
    }

    $scope.dblClickCampo = function(campo) {
        if (campo.aberto) {
            var linha = campo.linha;
            var coluna = campo.coluna;
            camposEmVolta = [
                {linha: linha - 1, coluna: coluna - 1},
                {linha: linha - 1, coluna: coluna},
                {linha: linha - 1, coluna: coluna + 1},
                {linha: linha, coluna: coluna - 1},
                {linha: linha, coluna: coluna + 1},
                {linha: linha + 1, coluna: coluna - 1},
                {linha: linha + 1, coluna: coluna},
                {linha: linha + 1, coluna: coluna + 1}
            ];
            var totalBombas = 0;
            var arrayCamposFechados = [];
            angular.forEach(camposEmVolta, function (object) {
                var objectCampo = getCampo(object.linha, object.coluna);
                if (objectCampo) {
                    if (objectCampo.marcado) {
                        totalBombas++;
                    } else {
                        arrayCamposFechados.push(objectCampo);
                    }
                }
            });
            if (totalBombas == campo.valor) {
                angular.forEach(arrayCamposFechados, function (object) {
                    if (object.bomba) {
                       abreTabuleiro("perdeu"); 
                    }
                    object.aberto = true;
                    if (!object.valor) {
                        abreCamposVazios(object);
                    }
                });
            }
        }
    }
    $scope.reiniciarJogo();
});

app.directive('ngRightClick', function($parse) {
    return function(scope, element, attrs) {
        var fn = $parse(attrs.ngRightClick);
        element.bind('contextmenu', function(event) {
            scope.$apply(function() {
                event.preventDefault();
                fn(scope, {$event:event});
            });
        });
    };
});
