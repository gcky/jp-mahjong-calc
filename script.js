function calcPoints() {
    let fan = Number($('#fan').val());
    let fu = 20;
    const jongWin = $('#jong-id').val() == $('#winner-id').val();
    if ($('#seven-pairs').prop('checked')) {
        fan -= 1;
        fu = 50;
    } else {
        if ($('#single-call').prop('checked')) {
            fu += 2;
        }
        if ($('#door-ching').prop('checked') && 
            !$('#culprit-id').val() == 'self') {
            fu += 10;
        }
        if ($('#culprit-id').val() == 'self' && 
            !$('#ping-flower').prop('checked') &&
            !$('#door-ching').prop('checked')) {
            fu += 2;
        }
        if ($('#own-wind-eye').prop('checked')) {
            fu += 2;
        }
        if ($('#board-wind-eye').prop('checked')) {
            fu += 2;
        }
        if ($('#three-dollar-eye').prop('checked')) {
            fu += 2;
        }
        fu += 2*$('#minghak28').val();
        fu += 4*$('#minghak19').val();
        fu += 4*$('#amhak28').val();
        fu += 8*$('#amhak19').val();
        fu += 8*$('#minggong28').val();
        fu += 16*$('#minggong19').val();
        fu += 16*$('#amgong28').val();
        fu += 32*$('#amgong19').val();
        fu = Math.ceil(fu/10)*10;
        if (fan == 1 && fu == 20) {
            fu = 30;
        }
    }
    let basicPoints = fu*Math.pow(2, fan+2);
    let winnerScore = 0;
    let jongScore = null;
    let haanScore = null;
    let chutchungScore = null;
    if (fan == 6 || fan == 7) {
        basicPoints = 3000;
    } else if (fan >= 8 && fan <= 10) {
        basicPoints = 4000;
    } else if (fan == 11 || fan == 12) {
        basicPoints = 6000;
    } else if (fan > 12) {
        basicPoints = 8000;
    } else if (fan == 5 || basicPoints > 2000) {
        basicPoints = 2000;
    } else if (basicPoints < 2000) {
        basicPoints = fu*Math.pow(2, fan+2);
    }
    if (jongWin) {
        if ($('#culprit-id').val() == 'self') {
            haanScore = -Math.ceil((2*basicPoints)/100)*100;
            winnerScore = -3*haanScore;
        } else {
            chutchungScore = -Math.ceil((6*basicPoints)/100)*100;
            winnerScore = -chutchungScore;
        }
    } else {
        if ($('#culprit-id').val() == 'self') {
            jongScore = -Math.ceil((2*basicPoints)/100)*100;
            haanScore = -Math.ceil(basicPoints/100)*100;
            winnerScore = -jongScore-2*haanScore;
        } else {
            chutchungScore = -Math.ceil((4*basicPoints)/100)*100;
            winnerScore = -chutchungScore;
        }
    }
    console.log(fu)
    console.log(basicPoints)
    displayGameResults(winnerScore, jongScore, haanScore, chutchungScore);
}

function displayGameResults(winnerScore, jongScore, haanScore, culpritScore) {
    $('.game-results tr td:nth-child(3)').html('');
    $('.game-results tr td:nth-child(3)').removeClass('win');
    const winner = $('#winner-id').val();
    const culprit = $('#culprit-id').val();
    const jong = $('#jong-id').val();
    const haan = ['A','B','C','D'].filter(function(elem){
        return elem != winner && elem != jong; 
    });
    if (winnerScore) {
        $('#score'+winner).html('+'+winnerScore);
        $('#score'+winner).addClass('win');
        if (culpritScore) {
            $('#score'+culprit).html(culpritScore);
        } else if (jongScore) {
            $('#score'+jong).html(jongScore);
            haan.forEach(function (player) {
                $('#score'+player).html(haanScore);
            });
        } else if (haanScore) {
            haan.forEach(function (player) {
                $('#score'+player).html(haanScore);
            });
        }
    }
}

function reset() {
    $('input:checkbox').prop('checked', false);
    $('#jong').prop('checked', false);
    $('#haan').prop('checked', true);
    $('#fan').val(1);
    $('.hakgong tr td select option:first-child').prop('selected', true);
    $('#winner-id option[value=""]').prop('selected', true);
    $('#culprit-id option[value=""]').prop('selected', true);
    checkCalcAvailability();
    displayGameResults(null, null, null, null);
}

function threeDollarClicked() {
    if ($('#three-dollar-eye').prop('checked')) {
        $('#own-wind-eye').prop('checked', false);
        $('#board-wind-eye').prop('checked', false);
    }
}

function windEyeClicked() {
    if ($('#own-wind-eye').prop('checked') ||
        $('#board-wind-eye').prop('checked')) {
        $('#three-dollar-eye').prop('checked', false);
    }
}

function sevenPairsClicked() {
    if ($('#seven-pairs').prop('checked')) {
        $('.hakgong tr td select option:first-child').prop('selected', true);
        if ($('#fan').val() < 2) {
            $('#fan').val(2);
        }
    }
}

function hakgongChanged() {
    $('#seven-pairs').prop('checked', false);
}

function showFanBlocks() {
    if ($('.options.fan-container').hasClass('show')) {
        $('.options.fan-container').removeClass('show');
    } else {
        $('.options.fan-container').addClass('show');
    }
}

function winnerChanged() {
    const winner = $('#winner-id').val();
    const culprit = $('#culprit-id').val();
    $('#culprit-id option').prop('disabled', false);
    if (winner == culprit) {
        $('#culprit-title').prop('selected', true);
    }
    $('#culprit-title').prop('disabled', true);
    $('#culprit'+winner).prop('disabled', true);
}

$(function() {
    $('.player-select').on('change', checkCalcAvailability).change();
});

function checkCalcAvailability() {
    var $sels = $('.player-select option:selected[value=""]');
    $("#calc-btn").attr("disabled", $sels.length > 0);
}

function resetGameHistory() {
    const startPoints = Number($('#start-points').val());
    games = [[startPoints, startPoints, startPoints, startPoints]];
    genGameHistoryTable();
}

var games = [[20000, 20000, 20000, 20000]];

function addHistory(noWin) {
    let newScores = [null, null, null, null];
    if (noWin) {
        newScores = games[games.length-1].slice();
    } else {
        $('.game-results tr td:nth-child(3)').each(function (idx){
            newScores[idx] = Number(games[games.length-1][idx]) + Number($(this).html());
        });
    }
    games.push(newScores);
    genGameHistoryTable();
}

function removeLastGame() {
    if (games.length > 1) {
        games.splice(-1,1);
        genGameHistoryTable();
    }
}

function genGameHistoryTable() {
    $('.game-table .game-rows').html('');
    games.forEach(function (game, idx) {
        let newCells = [$('<td>'), $('<td>'), $('<td>'), $('<td>')];
        if (idx > 0) {
            const prev = games[idx-1];
            const current = games[idx];
            let diff = current.map(function(item, index) {
                return item - prev[index];
            });
            diff.forEach(function (elem, idx) {
                if (elem > 0) {
                    newCells[idx].addClass('win-cell');
                } else if (elem < 0) {
                    newCells[idx].addClass('lose-cell');
                }
            });
        }
        $('.game-table').find('.game-rows')
        .append($('<tr>')
            .append(
                $('<td>').append(idx),
                newCells[0].append(game[0]),
                newCells[1].append(game[1]),
                newCells[2].append(game[2]),
                newCells[3].append(game[3])
            )
        );
    });
}

function amendScore(player, delta) {
    games[games.length-1][player] += Number(delta);
    genGameHistoryTable();
}

window.onbeforeunload = function() {
    return "The game history will be lost, are you sure?";
};

$(document).ready(function() {
    genGameHistoryTable();
});