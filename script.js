$(document).on('click', '#calc-btn', calcPoints);
$(document).on('click', '#reset-btn', resetCalc);

function calcPoints() {
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
}

function calcScores(basicPoints) {
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
}

function calcFu(han) {
    let fu = 20;
    if ($('#single-call').prop('checked')) {
        fu += 2;
    }
    if ($('#door-ching').prop('checked') && 
        !$('#discarder-id').val() == 'self') {
        fu += 10;
    }
    if ($('#discarder-id').val() == 'self' && 
        !$('#ping-flower').prop('checked') &&
        !$('#door-ching').prop('checked')) {
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
}

function calcBasicPoints(han, fu) {
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
}

function displayGameResults(winnerScore, dealerScore, childScore, discarderScore) {
    $('.game-results tr td:nth-child(3)').html('');
    $('.game-results tr td:nth-child(3)').removeClass('win');
    genCurrentGameResults(winnerScore, dealerScore, childScore, discarderScore);
    const label = ['A','B','C','D'];
    const gameStat = $('#game-results').data('gameStat');
    gameStat.scores.forEach(function (score, idx) {
        $('#score'+label[idx]).html(score > 0 ? score : score);
        if (score > 0) {
            $('#score'+label[idx]).addClass('win');
        }
    });
}

function genCurrentGameResults(winnerScore, dealerScore, childScore, discarderScore) {
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
}

function resetCalc() {
    $('input:checkbox').prop('checked', false);
    $('#dealer').prop('checked', false);
    $('#child').prop('checked', true);
    $('#han').val(1);
    $('.hakgong tr td select option:first-child').prop('selected', true);
    $('#winner-id option[value=""]').prop('selected', true);
    $('#discarder-id option[value=""]').prop('selected', true);
    checkCalcAvailability();
    displayGameResults(null, null, null, null);
}

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
});

$(document).on('change', '.hakgong', function () {
    $('#seven-pairs').prop('checked', false);
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

$(function() {
    $('.player-select').on('change', checkCalcAvailability).change();
});

function checkCalcAvailability() {
    var $sels = $('.player-select option:selected[value=""]');
    $("#calc-btn").attr("disabled", $sels.length > 0);
}

$(document).on('click', '#reset-hist-btn', function () {
    const defaultGameStat = {
        dealer: null,
        winner: null,
        discarder: null,
        child: null,
        noWin: false,
        scores: [null, null, null, null]
    };
    const startPoints = Number($('#start-points').val());
    const games = [[defaultGameStat, [startPoints, startPoints, startPoints, startPoints]]];
    $('#game-table').data('games', games);
    genGameHistoryTable();
});

$(document).on('click', '#add-hist-btn', function () {
    addHistory(false);
});

$(document).on('click', '#add-nowin', function () {
    addHistory(true);
});

function addHistory(noWin) {
    let gameStat = $('#game-results').data('gameStat');
    let newScores = [null, null, null, null];
    let games = $('#game-table').data('games');
    if (noWin || gameStat.noWin) {
        newScores = games[games.length-1][1].slice();
    } else {
        newScores = games[games.length-1][1].map(function (current, idx) {
            return current + gameStat.scores[idx];
        }).slice();
    }
    games.push([gameStat, newScores]);
    $('#game-table').data('games', games);
    genGameHistoryTable();
}

$(document).on('click', '#remove-last', function () {
    let games = $('#game-table').data('games');
    if (games.length > 1) {
        games.splice(-1,1);
        $('#game-table').data('games', games);
        genGameHistoryTable();
    }
});

function genGameHistoryTable() {
    $('.game-table .game-rows').html('');
    let games = $('#game-table').data('games');
    games.forEach(function (game, idx) {
        let newCells = [$('<td>'), $('<td>'), $('<td>'), $('<td>'), $('<td>')];
        let diff = null;
        if (idx > 0) {
            const prev = games[idx-1][1];
            const current = games[idx][1];
            diff = current.map(function(item, index) {
                let x = item - prev[index];
                return x != 0 ? x : null;
            });
            if (game[0].winner) {
                const label = {A: 1, B: 2, C: 3, D: 4};
                newCells[label[game[0].winner]].addClass('win-cell');
            }
        }
        $('.game-table').find('.game-rows')
        .append($('<tr>')
            .append(
                $('<td>').append(idx),
                newCells[0].append(game[0].dealer),
                newCells[1].append(game[1][0]+(diff && diff[0] ? '<br><span>' + diff[0] + '</span>' : '')),
                newCells[2].append(game[1][1]+(diff && diff[1] ? '<br><span>' + diff[1] + '</span>' : '')),
                newCells[3].append(game[1][2]+(diff && diff[2] ? '<br><span>' + diff[2] + '</span>' : '')),
                newCells[4].append(game[1][3]+(diff && diff[3] ? '<br><span>' + diff[3] + '</span>' : '')),
            )
        );
    });
}

$(document).on('click', '.amend-btn', function () {
    const player = $(this).data('player');
    const delta = $(this).data('amendVal');
    let games = $('#game-table').data('games');
    games[games.length-1][1][player] += Number(delta);
    $('#game-table').data('games', games);
    genGameHistoryTable();
});

window.onbeforeunload = function() {
    return "The game history will be lost, are you sure?";
};

$(document).ready(function() {
    const defaultGameStat = {
        dealer: null,
        winner: null,
        discarder: null,
        child: null,
        noWin: false,
        scores: [null, null, null, null]
    };
    $('#game-table').data('games', [[defaultGameStat, [20000, 20000, 20000, 20000]]]);
    $('#game-results').data('gameStat', defaultGameStat);
    genGameHistoryTable();
});