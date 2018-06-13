var calculator = (function () {

    var evalScores = function () {
        let han = Number($('#han').val());
        let fu = 20;
        if ($('#seven-pairs').prop('checked')) {
            han -= 1;
            fu = 50;
        } else {
            fu = calcFu(han);
        }
        let basicPoints = calcBasicPoints(han, fu);
        let winnerScore = 0;
        let dealerScore = null;
        let childScore = null;
        let discarderScore = null;
        [winnerScore, dealerScore, childScore, discarderScore] = calcScores(basicPoints);
        console.log(fu)
        console.log(basicPoints)
        displayGameResults(winnerScore, dealerScore, childScore, discarderScore);
    };

    var resetCalc = function () {
        $('input:checkbox').prop('checked', false);
        $('#dealer').prop('checked', false);
        $('#child').prop('checked', true);
        $('#draw').prop('checked', false);
        $('.tenpai').slideUp();
        $('.non-draw').slideDown();
        $('#han').val(1).trigger('change');
        $('.hakgong tr td select option:first-child').prop('selected', true);
        $('#winner-id option[value=""]').prop('selected', true);
        $('#discarder-id option[value=""]').prop('selected', true);
        checkCalcAvailability();
        displayGameResults(null, null, null, null);
    };

    var checkCalcAvailability = function () {
        var sels = $('.player-select option:selected[value=""]');
        $("#calc-btn").attr("disabled", sels.length > 0);
    };

    var attachCurrentGameStats = function (winnerScore, dealerScore, childScore, discarderScore) {
        const idx = {A: 0, B: 1, C: 2, D: 3};
        const winner = $('#winner-id').val();
        const discarder = $('#discarder-id').val();
        const dealer = $('#dealer-id').val();
        const child = ['A','B','C','D'].filter(function(elem){
            return elem != winner && elem != dealer; 
        });
        let gameStat = {
            dealer: dealer,
            winner: winner,
            discarder: discarder,
            child: child,
            noWin: false,
            scores: [null, null, null, null]
        };
        if (winnerScore) {
            gameStat.scores[idx[winner]] = winnerScore;
            if (discarderScore) {
                gameStat.scores[idx[discarder]] = discarderScore;
            } else {
                if (dealerScore) {
                    gameStat.scores[idx[dealer]] = dealerScore;
                }
                child.forEach(function (player) {
                    gameStat.scores[idx[player]] = childScore;
                });
            }
        } else {
            gameStat.noWin = true;
        }
        $('#game-results').data('gameStat', gameStat);
    };

    var calcScores = function (basicPoints) {
        let winnerScore = 0;
        let dealerScore = null;
        let childScore = null;
        let discarderScore = null;
        const dealerWin = $('#dealer-id').val() == $('#winner-id').val();
        if (dealerWin) {
            if ($('#discarder-id').val() == 'self') {
                childScore = -Math.ceil((2*basicPoints)/100)*100;
                winnerScore = -3*childScore;
            } else {
                discarderScore = -Math.ceil((6*basicPoints)/100)*100;
                winnerScore = -discarderScore;
            }
        } else {
            if ($('#discarder-id').val() == 'self') {
                dealerScore = -Math.ceil((2*basicPoints)/100)*100;
                childScore = -Math.ceil(basicPoints/100)*100;
                winnerScore = -dealerScore-2*childScore;
            } else {
                discarderScore = -Math.ceil((4*basicPoints)/100)*100;
                winnerScore = -discarderScore;
            }
        }
        return [winnerScore, dealerScore, childScore, discarderScore];
    };

    var calcFu = function (han) {
        let fu = 20;
        if ($('#single-call').prop('checked')) {
            fu += 2;
        }
        if ($('#door-ching').prop('checked') && 
            !($('#discarder-id').val() == 'self')) {
            fu += 10;
        }
        if ($('#discarder-id').val() == 'self' && 
            !($('#ping-flower').prop('checked')) &&
            !($('#door-ching').prop('checked'))) {
            fu += 2;
        }
        if ($('#seat-wind-eye').prop('checked')) {
            fu += 2;
        }
        if ($('#prevailing-wind-eye').prop('checked')) {
            fu += 2;
        }
        if ($('#dragon-eye').prop('checked')) {
            fu += 2;
        }
        fu += 2*$('#minko28').val();
        fu += 4*$('#minko19').val();
        fu += 4*$('#anko28').val();
        fu += 8*$('#anko19').val();
        fu += 8*$('#minkan28').val();
        fu += 16*$('#minkan19').val();
        fu += 16*$('#ankan28').val();
        fu += 32*$('#ankan19').val();
        fu = Math.ceil(fu/10)*10;
        if (han == 1 && fu == 20) {
            fu = 30;
        }
        return fu;
    };

    var calcBasicPoints = function (han, fu) {
        let basicPoints = fu*Math.pow(2, han+2);
        if (han == 6 || han == 7) {
            basicPoints = 3000;
        } else if (han >= 8 && han <= 10) {
            basicPoints = 4000;
        } else if (han == 11 || han == 12) {
            basicPoints = 6000;
        } else if (han > 12) {
            basicPoints = 8000;
        } else if (han == 5 || basicPoints > 2000) {
            basicPoints = 2000;
        } else if (basicPoints < 2000) {
            basicPoints = fu*Math.pow(2, han+2);
        }
        return basicPoints;
    };

    var displayGameResults = function (winnerScore, dealerScore, childScore, discarderScore) {
        $('.game-results tr td:nth-child(3)').html('');
        $('.game-results tr td:nth-child(3)').removeClass('win');
        attachCurrentGameStats(winnerScore, dealerScore, childScore, discarderScore);
        const label = ['A','B','C','D'];
        const gameStat = $('#game-results').data('gameStat');
        gameStat.scores.forEach(function (score, idx) {
            $('#score'+label[idx]).html(score > 0 ? score : score);
            if (score > 0) {
                $('#score'+label[idx]).addClass('win');
            }
        });
    };

    return {
        evalScores: evalScores,
        resetCalc: resetCalc,
        checkCalcAvailability: checkCalcAvailability
    };

})();

$(document).on('click', '#calc-btn', calculator.evalScores);

$(document).on('click', '#reset-btn', calculator.resetCalc);

$(document).on('click', '#dragon-eye', function () {
    if ($('#dragon-eye').prop('checked')) {
        $('#seat-wind-eye').prop('checked', false);
        $('#prevailing-wind-eye').prop('checked', false);
    }
});

$(document).on('click', '#seat-wind-eye, #prevailing-wind-eye', function () {
    if ($('#seat-wind-eye').prop('checked') ||
        $('#prevailing-wind-eye').prop('checked')) {
        $('#dragon-eye').prop('checked', false);
    }
});

$(document).on('click', '#seven-pairs', function () {
    if ($('#seven-pairs').prop('checked')) {
        $('.hakgong tr td select option:first-child').prop('selected', true);
        if ($('#han').val() < 2) {
            $('#han').val(2);
        }
    }
    $('#han').trigger('change');
});

$(document).on('change', '.hakgong', function () {
    $('#seven-pairs').prop('checked', false).trigger('change');
});

$(document).on('click', '.option-link', function () {
    if ($('.options.han-container').hasClass('show')) {
        $('.options.han-container').removeClass('show');
    } else {
        $('.options.han-container').addClass('show');
    }
});

$(document).on('change', '#winner-id', function () {
    const winner = $('#winner-id').val();
    const discarder = $('#discarder-id').val();
    $('#discarder-id option').prop('disabled', false);
    if (winner == discarder) {
        $('#discarder-title').prop('selected', true);
    }
    $('#discarder-title').prop('disabled', true);
    $('#discarder'+winner).prop('disabled', true);
});

$(document).on('change', '#han', function () {
    if ($(this).val() > 4 || $('#seven-pairs').prop('checked')) {
        $('.fu-options').slideUp();
    }
    if ($(this).val() < 2) {
        $('#seven-pairs').prop('checked', false).trigger('change');
    }
    if ($(this).val() < 5 && !($('#seven-pairs').prop('checked'))) {
        $('.fu-options').slideDown();
    }
});

$(function() {
    $('.player-select').on('change', calculator.checkCalcAvailability).change();
});

$(document).on('click', '#draw', function () {
    if ($(this).prop('checked')) {
        $('.tenpai').slideDown();
        $('.non-draw').slideUp();
    } else {
        $('.tenpai').slideUp();
        $('.non-draw').slideDown();
    }
});