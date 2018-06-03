var gameHistory = (function () {

    var addHistory = function (noWin) {
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
    };

    var genGameHistoryTable = function () {
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
    };

    return {
        addHistory: addHistory,
        genGameHistoryTable: genGameHistoryTable
    };

})();

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
    gameHistory.genGameHistoryTable();
});

$(document).on('click', '#add-hist-btn', function () {
    gameHistory.addHistory(false);
});

$(document).on('click', '#add-nowin', function () {
    gameHistory.addHistory(true);
});

$(document).on('click', '#remove-last', function () {
    let games = $('#game-table').data('games');
    if (games.length > 1) {
        games.splice(-1,1);
        $('#game-table').data('games', games);
        gameHistory.genGameHistoryTable();
    }
});

$(document).on('click', '.amend-btn', function () {
    const player = $(this).data('player');
    const delta = $(this).data('amendVal');
    let games = $('#game-table').data('games');
    games[games.length-1][1][player] += Number(delta);
    $('#game-table').data('games', games);
    gameHistory.genGameHistoryTable();
});